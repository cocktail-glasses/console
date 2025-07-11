package auth

import (
	"context"
	"flag"
	"fmt"
	"github.com/cocktailcloud/console/pkg/auth/cocktail"
	"github.com/cocktailcloud/console/pkg/auth/oauth2"
	"net/url"
	"os"

	"github.com/coreos/pkg/flagutil"

	utilerrors "k8s.io/apimachinery/pkg/util/errors"
	"k8s.io/client-go/rest"
	"k8s.io/klog/v2"

	"github.com/cocktailcloud/console/cmd/backend/config/flagvalues"
	"github.com/cocktailcloud/console/cmd/backend/config/session"
	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/auth/csrfverifier"
	"github.com/cocktailcloud/console/pkg/auth/static"
	"github.com/cocktailcloud/console/pkg/flags"
	"github.com/cocktailcloud/console/pkg/proxy"
	"github.com/cocktailcloud/console/pkg/server"
	"github.com/cocktailcloud/console/pkg/serverconfig"
)

type AuthOptions struct {
	AuthType flagvalues.AuthType

	IssuerURL            string
	ClientID             string
	ClientSecret         string
	ClientSecretFilePath string
	CAFilePath           string

	// DEV ONLY. When authentication is disabled, this token will be used for all requests.
	StaticUserBearerToken string

	ExtraScopes flagutil.StringSliceFlag

	InactivityTimeoutSeconds int
	LogoutRedirect           string
}

type CompletedOptions struct {
	*completedOptions
}
type completedOptions struct {
	AuthType flagvalues.AuthType

	IssuerURL    *url.URL
	ClientID     string
	ClientSecret string
	CAFilePath   string

	StaticUserBearerToken string

	ExtraScopes []string

	InactivityTimeoutSeconds int
	LogoutRedirectURL        *url.URL
}

func NewAuthOptions() *AuthOptions {
	return &AuthOptions{}
}

func (c *AuthOptions) AddFlags(fs *flag.FlagSet) {
	fs.Var(&c.AuthType, "user-auth", "User authentication provider type. Possible values: disabled, oidc, cocktail. Defaults to 'cocktail'")
	fs.StringVar(&c.IssuerURL, "user-auth-oidc-issuer-url", "", "The OIDC/OAuth2 issuer URL. or Cocktail API Server")
	fs.StringVar(&c.ClientID, "user-auth-oidc-client-id", "", "The OIDC/OAuth2 Client ID.")
	fs.StringVar(&c.ClientSecret, "user-auth-oidc-client-secret", "", "The OIDC/OAuth2 Client Secret.")
	fs.StringVar(&c.ClientSecretFilePath, "user-auth-oidc-client-secret-file", "", "File containing the OIDC/OAuth2 Client Secret.")
	fs.StringVar(&c.CAFilePath, "user-auth-oidc-ca-file", "", "Path to a PEM file for the OIDC/OAuth2 issuer CA.")
	fs.StringVar(&c.StaticUserBearerToken, "k8s-auth-bearer-token", "", "DEV ONLY. Static user token to be used when authentication is disabled. Can only be used with --user-auth=\"disabled\".")

	fs.Var(&c.ExtraScopes, "user-auth-oidc-token-scopes", "Comma-separated list of extra scopes to request ID tokens with")

	fs.IntVar(&c.InactivityTimeoutSeconds, "inactivity-timeout", 0, "Number of seconds, after which user will be logged out if inactive. Ignored if less than 300 seconds (5 minutes).")
	fs.StringVar(&c.LogoutRedirect, "user-auth-logout-redirect", "", "Optional redirect URL on logout needed for some single sign-on identity providers.")
}

func (c *AuthOptions) ApplyConfig(config *serverconfig.Auth) {
	serverconfig.SetIfUnset(&c.ClientID, config.ClientID)
	serverconfig.SetIfUnset(&c.IssuerURL, config.OIDCIssuer)
	serverconfig.SetIfUnset(&c.ClientSecretFilePath, config.ClientSecretFile)
	serverconfig.SetIfUnset(&c.CAFilePath, config.OAuthEndpointCAFile)
	serverconfig.SetIfUnset(&c.LogoutRedirect, config.LogoutRedirect)
	c.AuthType.Set(config.AuthType)

	if c.InactivityTimeoutSeconds == 0 {
		c.InactivityTimeoutSeconds = config.InactivityTimeoutSeconds
	}

	if len(c.ExtraScopes) == 0 {
		c.ExtraScopes = config.OIDCExtraScopes
	}
}

func (c *AuthOptions) Complete() (*CompletedOptions, error) {
	// default values before running validation
	if len(c.AuthType) == 0 {
		c.AuthType = flagvalues.AuthTypeCocktail
	}

	if c.InactivityTimeoutSeconds < 300 {
		klog.Warning("Flag inactivity-timeout is set to less then 300 seconds and will be ignored!")
		c.InactivityTimeoutSeconds = 0
	}

	if errs := c.Validate(); len(errs) > 0 {
		return nil, utilerrors.NewAggregate(errs)
	}

	completed := &completedOptions{
		AuthType:                 c.AuthType,
		ClientID:                 c.ClientID,
		ClientSecret:             c.ClientSecret,
		ExtraScopes:              c.ExtraScopes,
		CAFilePath:               c.CAFilePath,
		InactivityTimeoutSeconds: c.InactivityTimeoutSeconds,
		StaticUserBearerToken:    c.StaticUserBearerToken,
	}

	if len(c.IssuerURL) > 0 {
		issuerURL, err := url.Parse(c.IssuerURL)
		if err != nil {
			return nil, fmt.Errorf("invalid issuer URL: %w", err)
		}
		completed.IssuerURL = issuerURL
	}

	if len(c.LogoutRedirect) > 0 {
		logoutURL, err := url.Parse(c.LogoutRedirect)
		if err != nil {
			return nil, fmt.Errorf("invalid logout redirect URL: %w", err)
		}
		completed.LogoutRedirectURL = logoutURL
	}

	if len(c.ClientSecretFilePath) > 0 {
		buf, err := os.ReadFile(c.ClientSecretFilePath)
		if err != nil {
			return nil, fmt.Errorf("failed to read client secret file: %w", err)
		}
		completed.ClientSecret = string(buf)
	}

	return &CompletedOptions{
		completedOptions: completed,
	}, nil
}

func (c *AuthOptions) Validate() []error {
	var errs []error

	switch c.AuthType {
	case flagvalues.AuthTypeOIDC:
		if len(c.ClientID) == 0 {
			errs = append(errs, flags.NewRequiredFlagError("user-auth-oidc-client-id"))
		}

		if c.ClientSecret == "" && c.ClientSecretFilePath == "" {
			errs = append(errs, fmt.Errorf("must provide either --user-auth-oidc-client-secret or --user-auth-oidc-client-secret-file"))
		}

		if c.ClientSecret != "" && c.ClientSecretFilePath != "" {
			errs = append(errs, fmt.Errorf("cannot provide both --user-auth-oidc-client-secret and --user-auth-oidc-client-secret-file"))
		}

		if c.StaticUserBearerToken != "" {
			errs = append(errs, flags.NewInvalidFlagError("k8s-auth-bearer-token", "cannot be used with --user-auth=\"oidc\" or --user-auth=\"cocktail\""))
		}
	case flagvalues.AuthTypeDisabled:
	case flagvalues.AuthTypeCocktail:
	default:
		errs = append(errs, flags.NewInvalidFlagError("user-auth", "must be one of: oidc, openshift, disabled"))
	}

	switch c.AuthType {
	case flagvalues.AuthTypeCocktail:
		/*if len(c.IssuerURL) != 0 {
			errs = append(errs, flags.NewInvalidFlagError("user-auth-oidc-issuer-url", "cannot be used with --user-auth=\"cocktail\""))
		}

		if len(c.ExtraScopes) > 0 {
			errs = append(errs, flags.NewInvalidFlagError("user-auth-oidc-token-scopes", "cannot be used with --user-auth=\"cocktail\""))
		}*/

	case flagvalues.AuthTypeOIDC:
		if len(c.IssuerURL) == 0 {
			errs = append(errs, fmt.Errorf("--user-auth-oidc-issuer-url must be set if --user-auth=oidc"))
		}
	}
	switch c.AuthType {
	case flagvalues.AuthTypeOIDC, flagvalues.AuthTypeCocktail:
	default:
		if c.InactivityTimeoutSeconds > 0 {
			errs = append(errs, flags.NewInvalidFlagError("inactivity-timeout", "in order to activate the user inactivity timout, flag --user-auth must be one of: oidc, cocktail"))
		}
	}

	return errs
}

func (c *completedOptions) ApplyTo(
	srv *server.Server,
	k8sEndpoint *url.URL,
	caCertFilePath string,
	sessionConfig *session.CompletedOptions,
) error {
	srv.InactivityTimeout = c.InactivityTimeoutSeconds

	useSecureCookies := srv.BaseURL.Scheme == "https"

	if c.AuthType == flagvalues.AuthTypeDisabled && c.StaticUserBearerToken != "" {
		srv.InternalProxiedK8SClientConfig.BearerToken = c.StaticUserBearerToken
	}

	var err error
	srv.Authenticator, err = c.getAuthenticator(
		srv.BaseURL,
		k8sEndpoint,
		caCertFilePath,
		srv.InternalProxiedK8SClientConfig,
		useSecureCookies,
		sessionConfig,
	)

	if err != nil {
		return err
	}

	srv.CSRFVerifier = csrfverifier.NewCSRFVerifier(srv.BaseURL, useSecureCookies)
	return nil
}

func (c *completedOptions) getAuthenticator(
	baseURL *url.URL,
	k8sEndpoint *url.URL,
	caCertFilePath string,
	k8sClientConfig *rest.Config,
	useSecureCookies bool,
	sessionConfig *session.CompletedOptions,
) (auth.Authenticator, error) {

	if c.AuthType == flagvalues.AuthTypeDisabled {
		//if c.StaticUserBearerToken == "" {
		//	klog.Warning("console is disabled -- no authentication method configured")
		//	return nil, nil
		//}

		klog.Warning("running with AUTHENTICATION DISABLED -- for development use only!")
		return static.NewStaticAuthenticator(auth.User{
			Username: "managed-console-disabled",
			UserRole: auth.JoinUserRole([]string{"acornstack-cluster-admin"}),
			Token:    c.StaticUserBearerToken,
		}), nil
	}

	if c.AuthType == flagvalues.AuthTypeCocktail {
		return cocktail.NewCocktailAuthenticator(&cocktail.Config{
			IssuerURL:               c.IssuerURL.String(),
			LogoutRedirectURL:       proxy.SingleJoiningSlash(baseURL.String(), server.AuthLoginEndpoint),
			CookiePath:              "/",
			SecureCookies:           useSecureCookies,
			CookieEncryptionKey:     sessionConfig.CookieEncryptionKey,
			CookieAuthenticationKey: sessionConfig.CookieAuthenticationKey,
		})
	}

	flags.FatalIfFailed(flags.ValidateFlagNotEmpty("base-address", baseURL.String()))

	var (
		//err                      error
		userAuthOIDCIssuerURL    = c.IssuerURL
		authLoginErrorEndpoint   = proxy.SingleJoiningSlash(baseURL.String(), server.AuthLoginErrorEndpoint)
		authLoginSuccessEndpoint = proxy.SingleJoiningSlash(baseURL.String(), server.AuthLoginSuccessEndpoint)
		oidcClientSecret         = c.ClientSecret
		// Abstraction leak required by NewAuthenticator. We only want the browser to send the auth token for paths starting with basePath/api.
		cookiePath = proxy.SingleJoiningSlash(baseURL.Path, "/")
	)

	// Config for logging into console.
	oidcClientConfig := &oauth2.Config{
		AuthSource:   oauth2.AuthSourceOIDC,
		IssuerURL:    userAuthOIDCIssuerURL.String(),
		IssuerCA:     c.CAFilePath,
		ClientID:     c.ClientID,
		ClientSecret: oidcClientSecret,
		RedirectURL:  proxy.SingleJoiningSlash(baseURL.String(), server.AuthLoginCallbackEndpoint),
		Scope:        append(c.ExtraScopes, "openid"),

		// Use the k8s CA file for OpenShift OAuth metadata discovery.
		// This might be different than IssuerCA.
		K8sCA: caCertFilePath,

		ErrorURL:   authLoginErrorEndpoint,
		SuccessURL: authLoginSuccessEndpoint,

		CookiePath:              cookiePath,
		SecureCookies:           useSecureCookies,
		CookieEncryptionKey:     sessionConfig.CookieEncryptionKey,
		CookieAuthenticationKey: sessionConfig.CookieAuthenticationKey,

		// OIDC RP-Initiated logout 콜백 엔드포인트
		PostLogoutRedirectURL: proxy.SingleJoiningSlash(baseURL.String(), server.AuthLoginEndpoint),
	}

	if c.LogoutRedirectURL != nil {
		oidcClientConfig.LogoutRedirectOverride = c.LogoutRedirectURL.String()
	}
	authenticator, err := oauth2.NewOAuth2Authenticator(context.Background(), oidcClientConfig)
	if err != nil {
		klog.Fatalf("Error initializing authenticator: %v", err)
	}
	return authenticator, nil
}
