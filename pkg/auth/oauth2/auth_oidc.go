package oauth2

import (
	"context"
	"fmt"
	"k8s.io/klog/v2"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	oidc "github.com/coreos/go-oidc"
	"golang.org/x/oauth2"
	"k8s.io/client-go/rest"

	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/auth/sessions"
	"github.com/cocktailcloud/console/pkg/serverutils/asynccache"
)

type oauth2ConfigConstructor func(oauth2.Endpoint) *oauth2.Config

type oidcAuth struct {
	*oidcConfig

	providerCache *asynccache.AsyncCache[*oidc.Provider]

	// This preserves the old logic of associating users with session keys
	// and requires smart routing when running multiple backend instances.
	sessions *sessions.CombinedSessionStore
	metrics  *auth.Metrics

	refreshLock sync.Map // map [refreshToken -> sync.Mutex]
}

type oidcConfig struct {
	getClient              func() *http.Client
	issuerURL              string
	logoutRedirectOverride string
	clientID               string
	cookiePath             string
	secureCookies          bool
	constructOAuth2Config  oauth2ConfigConstructor
	internalK8sConfig      *rest.Config
	postLogoutRedirectURL  string // oidc RP-Initiated logout 처리 이후 리다이렉트 URL
}

func newOIDCAuth(ctx context.Context, sessionStore *sessions.CombinedSessionStore, c *oidcConfig) (*oidcAuth, error) {
	// NewProvider attempts to do OIDC Discovery
	providerCache, err := asynccache.NewAsyncCache[*oidc.Provider](
		ctx, 5*time.Minute,
		func(cacheCtx context.Context) (*oidc.Provider, error) {
			oidcCtx := oidc.ClientContext(cacheCtx, c.getClient())
			return oidc.NewProvider(oidcCtx, c.issuerURL)
		},
	)
	if err != nil {
		return nil, err
	}

	providerCache.Run(ctx)

	return &oidcAuth{
		oidcConfig:    c,
		providerCache: providerCache,
		sessions:      sessionStore,
		refreshLock:   sync.Map{},
	}, nil
}

func (o *oidcAuth) login(w http.ResponseWriter, r *http.Request, token *oauth2.Token) (*sessions.LoginState, error) {
	ls, err := o.sessions.AddSession(w, r, o.verify, token)
	if err != nil {
		return nil, err
	}

	return ls, nil
}

func (o *oidcAuth) refreshSession(ctx context.Context, w http.ResponseWriter, r *http.Request, oauthConfig *oauth2.Config, cookieRefreshToken string) (*sessions.LoginState, error) {
	actual, _ := o.refreshLock.LoadOrStore(cookieRefreshToken, &sync.Mutex{})
	actual.(*sync.Mutex).Lock()
	defer actual.(*sync.Mutex).Unlock()

	tokenRefreshHandling := auth.TokenRefreshUnknown
	defer func() {
		if o.metrics != nil {
			o.metrics.TokenRefreshRequest(tokenRefreshHandling)
		}
	}()

	session, err := o.sessions.GetSession(w, r)
	if err != nil {
		return nil, err
	}

	// if the refresh token got changed by someone else in the meantime (guarded by the refreshLock),
	//  use the most current session instead of doing the full token refresh
	if session != nil && session.RefreshToken() != cookieRefreshToken {
		tokenRefreshHandling = auth.TokenRefreshShortCircuit
		o.sessions.UpdateCookieRefreshToken(w, r, session.RefreshToken()) // we must update our own client session, too!
		return session, nil
	}

	tokenRefreshHandling = auth.TokenRefreshFull
	newTokens, err := oauthConfig.TokenSource(
		context.WithValue(ctx, oauth2.HTTPClient, o.getClient()), // supply our client with custom trust
		&oauth2.Token{RefreshToken: cookieRefreshToken},
	).Token()
	if err != nil {
		return nil, fmt.Errorf("failed to refresh a token %s: %w", cookieRefreshToken, err)
	}

	ls, err := o.sessions.UpdateTokens(w, r, o.verify, newTokens)
	if err != nil {
		return nil, fmt.Errorf("failed to update session tokens: %w", err)
	}

	return ls, nil
}

func (o *oidcAuth) verify(ctx context.Context, rawIDToken string) (*oidc.IDToken, error) {
	provider := o.providerCache.GetItem()
	return provider.Verifier(&oidc.Config{ClientID: o.clientID}).Verify(ctx, rawIDToken)
}

func (o *oidcAuth) DeleteCookie(w http.ResponseWriter, r *http.Request) {
	o.sessions.DeleteSession(w, r)
}

func (o *oidcAuth) logout(w http.ResponseWriter, r *http.Request) {
	user, err := o.Authenticate(w, r)
	if err != nil {
		klog.V(4).Infof("authentication failed: %v, redirecting to: %q", err, o.postLogoutRedirectURL)
		http.Redirect(w, r, o.postLogoutRedirectURL, http.StatusSeeOther)
		return
	}

	endSessionEndpoint := o.makeEndSessionEndpoint(o.LogoutRedirectURL(), user.Token, o.postLogoutRedirectURL)
	o.DeleteCookie(w, r)
	klog.Infof("cleared session: %s, OIDC RP-Initiated logout processing..., redirecting to: %q", user.Username, endSessionEndpoint)
	http.Redirect(w, r, endSessionEndpoint, http.StatusSeeOther)
}

func (o *oidcAuth) makeEndSessionEndpoint(endSessionEndpoint string, idToken string, redirectUri string) string {
	u, err := url.Parse(endSessionEndpoint)
	if err != nil {
		return ""
	}

	q := u.Query()

	q.Set("id_token_hint", idToken)
	q.Set("post_logout_redirect_uri", redirectUri)

	u.RawQuery = q.Encode()

	return u.String()
}

// LogoutFromChannel oidc 프로바이더로부터 로그아웃 알림을 받아 동기화합니다.
func (o *oidcAuth) LogoutFromChannel(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		klog.Errorf("failed to parse form: %v", err)
		return
	}

	rawLogoutToken := r.FormValue("logout_token")
	if rawLogoutToken == "" {
		klog.Errorf("logout_token not found")
		return
	}

	idToken, err := o.verify(r.Context(), rawLogoutToken)
	if err != nil {
		klog.Errorf("failed to logout_token verified: %v", err)
		return
	}

	o.sessions.CleanupByUserId(idToken.Subject)
}

func (o *oidcAuth) getLoginState(w http.ResponseWriter, r *http.Request) (*sessions.LoginState, error) {
	ls, err := o.sessions.GetSession(w, r)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve login state: %v", err)
	}

	if ls == nil || ls.ShouldRotate() {
		if refreshToken := o.sessions.GetCookieRefreshToken(r); refreshToken != "" {
			return o.refreshSession(r.Context(), w, r, o.oauth2Config(), refreshToken)
		}

		return nil, fmt.Errorf("a session was not found on server or is expired")
	}
	return ls, nil
}

func (o *oidcAuth) Authenticate(w http.ResponseWriter, r *http.Request) (*auth.User, error) {
	ls, err := o.getLoginState(w, r)
	if err != nil {
		return nil, err
	}

	accountCode := o.parseAccountCode(o.issuerURL)

	return &auth.User{
		ID:          ls.UserID(),
		Username:    ls.PreferredUsername(),
		Token:       ls.AccessToken(),
		AccountCode: accountCode,
		UserRole:    auth.JoinUserRole(ls.Groups()),
	}, nil
}

func (o *oidcAuth) parseAccountCode(issuerUrl string) string {
	tokens := strings.Split(issuerUrl, "/")

	return tokens[len(tokens)-1]
}

func (o *oidcAuth) GetSpecialURLs() auth.SpecialAuthURLs {
	return auth.SpecialAuthURLs{}
}

func (o *oidcAuth) LogoutRedirectURL() string {
	if len(o.logoutRedirectOverride) > 0 {
		return o.logoutRedirectOverride
	}

	sessionEndpoints := struct {
		// Get the RP-initiated logout endpoint (https://openid.net/specs/openid-connect-rpinitiated-1_0.html)
		EndSessionEndpoint string `json:"end_session_endpoint"`
	}{}

	provider := o.providerCache.GetItem()
	provider.Claims(&sessionEndpoints)

	return sessionEndpoints.EndSessionEndpoint
}

func (o *oidcAuth) oauth2Config() *oauth2.Config {
	return o.oidcConfig.constructOAuth2Config(o.providerCache.GetItem().Endpoint())
}
