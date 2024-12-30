package server

import (
	"compress/gzip"
	"fmt"
	"io"
	"k8s.io/klog/v2"
	"net/http"
	"strings"

	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/auth/csrfverifier"
	"github.com/cocktailcloud/console/pkg/serverutils"
)

type HandlerWithUser func(*auth.User, http.ResponseWriter, *http.Request)

// Middleware generates a middleware wrapper for request hanlders.
// Responds with 401 for requests with missing/invalid/incomplete token with verified email address.
func authMiddleware(authenticator auth.Authenticator, csrfVerifier *csrfverifier.CSRFVerifier, h http.HandlerFunc) http.HandlerFunc {
	return authMiddlewareWithUser(
		authenticator,
		csrfVerifier,
		func(user *auth.User, w http.ResponseWriter, r *http.Request) {
			h.ServeHTTP(w, r)
		},
	)
}

func authMiddlewareWithUser(authenticator auth.Authenticator, csrfVerifier *csrfverifier.CSRFVerifier, h HandlerWithUser) http.HandlerFunc {
	return csrfVerifier.WithCSRFVerification(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			rUrl := r.RequestURI
			if rUrl != "/api/auth/publickey" {
				user, err := authenticator.Authenticate(w, r)
				if err != nil {
					klog.V(4).Infof("authentication failed: %v", err)
					w.WriteHeader(http.StatusUnauthorized)
					return
				}
				r.Header.Set("Authorization", fmt.Sprintf("Bearer %s", user.Token))
				r.Header.Set("user-id", fmt.Sprintf("%s", user.UserId))
				r.Header.Set("user-role", fmt.Sprintf("%s", user.UserRole))
				r.Header.Set("account-seq", fmt.Sprintf("%s", user.AccountSeq))

				h(user, w, r)
			} else {
				h(&auth.User{}, w, r)
			}
		}),
	)
}

func allowMethods(methods []string, h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		for _, method := range methods {
			if r.Method == method {
				h.ServeHTTP(w, r)
				return
			}
		}
		allowedStr := strings.Join(methods, ", ")
		w.Header().Set("Allow", allowedStr)
		serverutils.SendResponse(w, http.StatusMethodNotAllowed, serverutils.ApiError{Err: fmt.Sprintf("Method '%s' not allowed. Allowed methods: %s", r.Method, allowedStr)})
	}
}

func allowMethod(method string, h http.HandlerFunc) http.HandlerFunc {
	return allowMethods([]string{method}, h)
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
	sniffDone bool
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	if !w.sniffDone {
		if w.Header().Get("Content-Type") == "" {
			w.Header().Set("Content-Type", http.DetectContentType(b))
		}
		w.sniffDone = true
	}
	return w.Writer.Write(b)
}

// gzipHandler wraps a http.Handler to support transparent gzip encoding.
func gzipHandler(h http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Accept-Encoding")
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			h.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		h.ServeHTTP(&gzipResponseWriter{Writer: gz, ResponseWriter: w}, r)
	}
}

func securityHeadersMiddleware(hdlr http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Prevent MIME sniffing (https://en.wikipedia.org/wiki/Content_sniffing)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// Ancient weak protection against reflected XSS (equivalent to CSP no unsafe-inline)
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		// Prevent clickjacking attacks involving iframes
		w.Header().Set("X-Frame-Options", "DENY")
		// Less information leakage about what domains we link to
		w.Header().Set("X-DNS-Prefetch-Control", "off")
		// Less information leakage about what domains we link to
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		hdlr.ServeHTTP(w, r)
	}
}
