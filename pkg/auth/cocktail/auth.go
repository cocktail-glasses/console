package cocktail

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/serverutils"
	"io/ioutil"
	"k8s.io/klog/v2"
	"net/http"
	"sync"
)

const (
	stateCookieName   = "login-state"
	errorOAuth        = "oauth_error"
	errorLoginState   = "login_state_error"
	errorCookie       = "cookie_error"
	errorInternal     = "internal_error"
	errorMissingCode  = "missing_code"
	errorMissingState = "missing_state"
	errorInvalidCode  = "invalid_code"
	errorInvalidState = "invalid_state"
)

var (
	httpClientCache            sync.Map
	httpClientCacheSystemRoots sync.Map
)

type CocktailAuthenticator struct {
	useEnhancedAuth bool
	loginURL        string
	sessions        *CombinedSessionStore
	user            *auth.User
}

type AuthSource int

const (
	AuthSourceOIDC     AuthSource = 0
	AuthSourceCocktail AuthSource = 1
)

type Config struct {
	AuthSource AuthSource

	IssuerURL              string
	LogoutRedirectOverride string // overrides the OIDC provider's front-channel logout URL
	IssuerCA               string
	RedirectURL            string
	ClientID               string
	ClientSecret           string
	Scope                  []string

	// K8sCA is required for OpenShift OAuth metadata discovery. This is the CA
	// used to talk to the master, which might be different than the issuer CA.
	K8sCA string

	SuccessURL string
	ErrorURL   string
	// cookiePath is an abstraction leak. (unfortunately, a necessary one.)
	CookiePath              string
	SecureCookies           bool
	CookieEncryptionKey     []byte
	CookieAuthenticationKey []byte
}

func NewCocktailAuthenticator(c *Config) (*CocktailAuthenticator, error) {

	sessionStore := NewSessionStore(
		c.CookieAuthenticationKey,
		c.CookieEncryptionKey,
		c.SecureCookies,
		c.CookiePath,
	)
	return &CocktailAuthenticator{
		sessions: sessionStore,
		loginURL: c.IssuerURL,
	}, nil
}

func (a *CocktailAuthenticator) LoginFunc(w http.ResponseWriter, r *http.Request) {

	var reqBody map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		klog.Errorf("Invalid request body : %v", err)
		return
	}

	loginPage := "/platform/login"
	loginUrl := fmt.Sprintf("%s/api/auth/login", a.loginURL)
	if a.useEnhancedAuth {
		loginUrl = fmt.Sprintf("%s/api/auth/admin/login", a.loginURL)
		loginPage = "/admin/login"
		if reqBody["loginMode"] == "PLATFORM_ADMIN" {
			loginUrl = fmt.Sprintf("%s/api/auth/platform/admin/login", a.loginURL)
			loginPage = "/platform/admin/login"
		} else if reqBody["loginMode"] == "PLATFORM_USER" {
			loginUrl = fmt.Sprintf("%s/api/auth/platform/user/login", a.loginURL)
			loginPage = "/platform/login"
		}
	}

	// Decrypt the body if necessary
	if r.Header.Get("encryption-body") == "a" {
		decryptedBody, err := DecryptAES256CBC(reqBody["data"].(string), "cocktail-glasses_encryption_data", "cocktail-glasses")
		if err != nil {
			http.Error(w, "Failed to decrypt body", http.StatusInternalServerError)
			return
		}
		if err := json.Unmarshal([]byte(decryptedBody), &reqBody); err != nil {
			klog.Errorf("Invalid decryptedBody : %v", err)
			return
		}
	}

	// Send the login request
	respJSON, err := json.Marshal(reqBody)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to JSON-marshal the response: %v", err), http.StatusInternalServerError)
		return
	}

	request, err := http.NewRequest("POST", loginUrl, bytes.NewBuffer(respJSON))
	if err != nil {
		errMsg := fmt.Sprintf("Failed to marshal the response: %v", err)
		klog.Error(errMsg)
		serverutils.SendResponse(w, http.StatusBadRequest, serverutils.ApiError{Err: errMsg})
		return
	}

	for name, values := range r.Header {
		for _, value := range values {
			request.Header.Add(name, value)
		}
	}

	serviceClient := &http.Client{}

	resp, err := serviceClient.Do(request)
	if err != nil {
		http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
		return
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)
	var respData map[string]interface{}
	if err := json.Unmarshal([]byte(respBody), &respData); err != nil {
		klog.Errorf("Invalid decryptedBody : %v", err)
		return
	}
	if resp.StatusCode == http.StatusOK && respData["status"] == "ok" {

		content := respData
		userMap := content["result"].(map[string]interface{})
		content["result"].(map[string]interface{})["loginPage"] = loginPage

		// Encrypt the response body if necessary
		if r.Header.Get("encryption-body") == "a" {
			r, err := EncryptAES256CBC(toJSON(content["result"]), "cocktail-glasses_encryption_data", "cocktail-glasses")
			if err != nil {
				return

			}
			content["result"] = r
		} else if r.Header.Get("encryption-body") != "off" {
		} else {
			content["result"] = encryptAES(content["result"])
		}

		if userMap["userRole"] != nil {
			s := userMap["userSeq"]
			id := userMap["userId"]
			ur := userMap["userRole"]

			user := &auth.User{
				UserId:   fmt.Sprintf("%v", id),
				UserRole: fmt.Sprintf("%v", ur),
				UserSeq:  fmt.Sprintf("%v", s),
			}
			_, err := a.sessions.AddSession(w, r, user)
			if err != nil {
				http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
				return
			}
		}
		//handleSuccessfulLogin(w, r, respData, loginPage)
		//a.sessions.AddSession(w, r, nil, nil)
		w.WriteHeader(resp.StatusCode)
		w.Write(respBody)
	} else {
		w.WriteHeader(resp.StatusCode)
		w.Write(respBody)
	}
}
func (a *CocktailAuthenticator) LogoutFunc(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

func (s *CocktailAuthenticator) Authenticate(w http.ResponseWriter, r *http.Request) (*auth.User, error) {
	ls, err := s.sessions.GetSession(w, r)
	if err != nil {
		return nil, err
	}
	return ls, nil
}

func (s *CocktailAuthenticator) CallbackFunc(fn func(successURL string, w http.ResponseWriter)) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) { w.WriteHeader(http.StatusNoContent) }
}

func (s *CocktailAuthenticator) LogoutRedirectURL() string            { return "" }
func (s *CocktailAuthenticator) GetSpecialURLs() auth.SpecialAuthURLs { return auth.SpecialAuthURLs{} }
func (s *CocktailAuthenticator) IsStatic() bool                       { return true }
