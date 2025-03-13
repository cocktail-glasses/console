package cocktail

import (
	"encoding/gob"
	"fmt"
	"github.com/cocktailcloud/console/pkg/auth"
	"net/http"
	"os"
	"strings"
	"sync"

	gorilla "github.com/gorilla/sessions"
)

const (
	CocktailAccessTokenCookieName = "cocktail"
)

func init() {
	// gob 에 구조체 등록
	gob.Register(&auth.User{})
}

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
	/*userData, err := json.Marshal(user)
	if err != nil {
		http.Error(w, "Failed to encode user data", http.StatusInternalServerError)
		return nil, err
	}*/
	gob.Register(user)
	clientSession.sessionToken.Values["user"] = user
	paths := []string{"/api", "/builder", "/monitoring-api", "/cluster-api", "/alarm-api", "/metric-api", "/backup-api", "/ws", "/terminal", "/apis/package", "/apm", "/sm,", "/v1alpha1", "/k8s"}
	var errs []error
	for _, path := range paths {
		clientSession.sessionToken.Options.Path = path
		err := clientSession.save(r, w)
		if err != nil {
			errs = append(errs, err)
		}
	}
	if len(errs) > 0 {
		return user, fmt.Errorf(joinErrors(errs))
	}

	return user, nil
	//return user, clientSession.save(r, w)
}

func joinErrors(errs []error) string {
	es := make([]string, 0, len(errs))
	for _, e := range errs {
		es = append(es, e.Error())
	}
	return strings.Join(es, "; ")
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

	val := clientSession.sessionToken.Values["user"]
	if val == nil {
		fmt.Fprintln(w, "No user information in session")
		//return
	}

	user, ok := val.(*auth.User)
	if !ok {
		return nil, fmt.Errorf("Failed to decode user information ")
	}

	return user, nil
}

func (cs *CombinedSessionStore) DeleteSession(w http.ResponseWriter, r *http.Request) error {
	cs.sessionLock.Lock()
	defer cs.sessionLock.Unlock()

	for _, cookie := range r.Cookies() {
		cookie := cookie
		if strings.HasPrefix(cookie.Name, CocktailAccessTokenCookieName) {
			cookie.MaxAge = -1
			http.SetCookie(w, cookie)
		}
	}

	cookieSession := cs.getCookieSession(r)

	cookieSession.sessionToken.Options.MaxAge = -1
	err := cookieSession.sessionToken.Save(r, w)
	if err != nil {
		return fmt.Errorf("Failed to delete session: %w ", err)
	}

	return nil
}
