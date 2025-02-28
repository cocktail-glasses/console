package auth

import (
	"github.com/cocktailcloud/console/pkg/auth/sessions"
	"net/http"
)

type Authenticator interface {
	Authenticate(w http.ResponseWriter, req *http.Request) (*User, error)

	LoginFunc(w http.ResponseWriter, req *http.Request)
	LogoutFunc(w http.ResponseWriter, req *http.Request)
	CallbackFunc(fn func(loginInfo sessions.LoginJSON, successURL string, w http.ResponseWriter)) func(w http.ResponseWriter, req *http.Request)

	LogoutRedirectURL() string
	GetSpecialURLs() SpecialAuthURLs
	IsStatic() bool
}

type SpecialAuthURLs struct {
	// RequestToken is a special page in the OpenShift integrated OAuth server for requesting a token.
	RequestToken string
	// KubeAdminLogout is the logout URL for the special kube:admin user in OpenShift.
	KubeAdminLogout string
}

// User holds fields representing a user.
type User struct {
	ID            string `json:"id"`
	Username      string `json:"username"`
	Token         string `json:"token"`
	UserId        string `json:"userId"`
	UserRole      string `json:"userRole"`
	UserWorkspace string `json:"userWorkspace"`
	UserSeq       string `json:"userSeq"`
	AccountSeq    string `json:"accountSeq"`
	AccountCode   string `json:"accountCode"`
}
