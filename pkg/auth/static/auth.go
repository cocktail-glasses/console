package static

import (
	"github.com/cocktailcloud/console/pkg/auth/sessions"
	"net/http"

	"github.com/cocktailcloud/console/pkg/auth"
)

type StaticAuthenticator struct {
	user *auth.User
}

func NewStaticAuthenticator(user auth.User) *StaticAuthenticator {
	return &StaticAuthenticator{
		user: &user,
	}
}

func (s *StaticAuthenticator) Authenticate(w http.ResponseWriter, req *http.Request) (*auth.User, error) {
	userCopy := *s.user
	return &userCopy, nil
}

func (s *StaticAuthenticator) LoginFunc(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}
func (s *StaticAuthenticator) LogoutFunc(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

func (s *StaticAuthenticator) CallbackFunc(fn func(loginInfo sessions.LoginJSON, successURL string, w http.ResponseWriter)) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) { w.WriteHeader(http.StatusNoContent) }
}

func (s *StaticAuthenticator) LogoutRedirectURL() string            { return "" }
func (s *StaticAuthenticator) GetSpecialURLs() auth.SpecialAuthURLs { return auth.SpecialAuthURLs{} }
func (s *StaticAuthenticator) IsStatic() bool                       { return true }
