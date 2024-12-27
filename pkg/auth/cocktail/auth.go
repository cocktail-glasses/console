package cocktail

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/auth/sessions"
	"io/ioutil"
	"net/http"
)

type CocktailAuthenticator struct {
	useEnhancedAuth bool
	loginURL        string
}

func NewCocktailAuthenticator(loginURL string) *CocktailAuthenticator {
	return &CocktailAuthenticator{
		loginURL:        loginURL,
		useEnhancedAuth: false,
	}
}

func (s *CocktailAuthenticator) Authenticate(w http.ResponseWriter, req *http.Request) (*auth.User, error) {
	return &auth.User{
		ID:       "",
		Username: "",
		Token:    "",
	}, nil
}

func (s *CocktailAuthenticator) LoginFunc(w http.ResponseWriter, req *http.Request) {

	var reqBody map[string]interface{}
	if err := json.NewDecoder(req.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	loginUrl := fmt.Sprintf("%s/api/auth/login", s.loginURL)
	loginPage := "/platform/login"
	if !s.useEnhancedAuth {
		loginUrl = fmt.Sprintf("%s/api/auth/admin/login", s.loginURL)
		loginPage = "/admin/login"
		if reqBody["loginMode"] == "PLATFORM_ADMIN" {
			loginUrl = fmt.Sprintf("%s/api/auth/platform/admin/login", s.loginURL)
			loginPage = "/platform/admin/login"
		} else if reqBody["loginMode"] == "PLATFORM_USER" {
			loginUrl = fmt.Sprintf("%s/api/auth/platform/user/login", s.loginURL)
			loginPage = "/platform/login"
		}
	}
	if reqBody["loginMode"] == "PLATFORM_DEMO" {
		loginUrl = fmt.Sprintf("%s/api/auth/login", s.loginURL)
		loginPage = "/platform/demo/login"
	}

	// Decrypt the body if necessary
	if req.Header.Get("encryption-body") == "a" {
		decryptedBody, err := DecryptAES256CBC(reqBody["data"].(string), "cocktail-glasses_encryption_data", "cocktail-glasses")
		if err != nil {
			http.Error(w, "Failed to decrypt body", http.StatusInternalServerError)
			return
		}
		json.Unmarshal([]byte(decryptedBody), &reqBody)
	}

	// Send the login request
	reqBodyBytes, _ := json.Marshal(reqBody)
	resp, err := http.Post(loginUrl, "application/json", bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		http.Error(w, "Service unavailable", http.StatusServiceUnavailable)
		return
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)
	var respData map[string]interface{}
	json.Unmarshal(respBody, &respData)

	if resp.StatusCode == http.StatusOK && respData["status"] == "ok" {
		handleSuccessfulLogin(w, req, respData, loginPage)
	} else {
		w.WriteHeader(resp.StatusCode)
		w.Write(respBody)
	}

	w.WriteHeader(http.StatusNoContent)
}
func (s *CocktailAuthenticator) LogoutFunc(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

func (s *CocktailAuthenticator) CallbackFunc(fn func(loginInfo sessions.LoginJSON, successURL string, w http.ResponseWriter)) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) { w.WriteHeader(http.StatusNoContent) }
}

func (s *CocktailAuthenticator) GetOCLoginCommand() string            { return "" }
func (s *CocktailAuthenticator) LogoutRedirectURL() string            { return "" }
func (s *CocktailAuthenticator) GetSpecialURLs() auth.SpecialAuthURLs { return auth.SpecialAuthURLs{} }
func (s *CocktailAuthenticator) IsStatic() bool                       { return true }
