package cocktail

import (
	"fmt"
	"github.com/cocktailcloud/console/pkg/auth"
	"net/http"
	"os"
	"sync"

	gorilla "github.com/gorilla/sessions"
)

const (
	CocktailAccessTokenCookieName = "cocktail-session-token"
)

type CombinedSessionStore struct {
	clientStore *gorilla.CookieStore // FIXME: we need to determine what the default session expiration should be, possibly make it configurable
	sessionLock sync.Mutex
}

type session struct {
	sessionToken *gorilla.Session
}

func SessionCookieName() string {
	podName, _ := os.LookupEnv("POD_NAME")
	return CocktailAccessTokenCookieName + "-" + podName
}

func NewSessionStore(authnKey, encryptKey []byte, secureCookies bool, cookiePath string) *CombinedSessionStore {
	clientStore := gorilla.NewCookieStore(authnKey, encryptKey)
	clientStore.Options.Secure = secureCookies
	clientStore.Options.HttpOnly = true
	clientStore.Options.SameSite = http.SameSiteStrictMode
	clientStore.Options.Path = cookiePath

	return &CombinedSessionStore{
		clientStore: clientStore,

		sessionLock: sync.Mutex{},
	}
}

func (cs *CombinedSessionStore) AddSession(w http.ResponseWriter, r *http.Request, user *auth.User) (*auth.User, error) {
	cs.sessionLock.Lock()
	defer cs.sessionLock.Unlock()

	clientSession := cs.getCookieSession(r)
	clientSession.sessionToken.AddFlash(user)

	//clientSession.sessionToken.Values["user-seq"] = user.UserSeq
	//clientSession.sessionToken.Values["user-id"] = user.UserId
	//clientSession.sessionToken.Values["user-role"] = user.UserRole
	//clientSession.sessionToken.Values["account-seq"] = user.AccountSeq
	//clientSession.sessionToken.Values["account-code"] = user.AccountCode
	//clientSession.sessionToken.Values["user-workspace"] = user.UserWorkspace

	return user, clientSession.save(r, w)
}

func (cs *CombinedSessionStore) getCookieSession(r *http.Request) *session {
	clientSession, _ := cs.clientStore.Get(r, SessionCookieName())
	return &session{
		sessionToken: clientSession,
	}
}

func (s *session) save(r *http.Request, w http.ResponseWriter) error {
	if err := s.sessionToken.Save(r, w); err != nil {
		return fmt.Errorf("failed to save session token cookie: %w", err)
	}

	return nil
}

// GetSession returns a session identified by the cookie from the current request.
// If the session is already expired, it deletes it and returns nil instead.
func (cs *CombinedSessionStore) GetSession(w http.ResponseWriter, r *http.Request) (*auth.User, error) {
	cs.sessionLock.Lock()
	defer cs.sessionLock.Unlock()

	// Get always returns a session, even if empty.
	clientSession := cs.getCookieSession(r)

	user := clientSession.sessionToken.Flashes()
	custom := user[0].(*auth.User)

	return custom, nil
}

func (cs *CombinedSessionStore) DeleteSession(w http.ResponseWriter, r *http.Request) error {
	cs.sessionLock.Lock()
	defer cs.sessionLock.Unlock()

	/*	for _, cookie := range r.Cookies() {
			cookie := cookie
			if strings.HasPrefix(cookie.Name, CocktailAccessTokenCookieName) {
				cookie.MaxAge = -1
				http.SetCookie(w, cookie)
			}
		}

		cookieSession := cs.getCookieSession(r)

		if sessionToken, ok := cookieSession.sessionToken.Values["session-token"]; ok {
			cs.serverStore.DeleteBySessionToken(sessionToken.(string))
		}*/

	return nil
}
