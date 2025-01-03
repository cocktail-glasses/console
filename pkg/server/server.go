package server

import (
	"context"
	"crypto/tls"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"path"
	"strings"
	"time"

	"github.com/coreos/pkg/health"
	"k8s.io/client-go/rest"
	"k8s.io/klog/v2"

	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/auth/csrfverifier"
	devconsoleProxy "github.com/cocktailcloud/console/pkg/devconsole/proxy"
	"github.com/cocktailcloud/console/pkg/graphql/resolver"
	"github.com/cocktailcloud/console/pkg/plugins"
	"github.com/cocktailcloud/console/pkg/proxy"
	"github.com/cocktailcloud/console/pkg/serverconfig"
	"github.com/cocktailcloud/console/pkg/serverutils"
	"github.com/cocktailcloud/console/pkg/utils"
	"github.com/cocktailcloud/console/pkg/version"
	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	operatorv1 "github.com/openshift/api/operator/v1"
	"github.com/rawagner/graphql-transport-ws/graphqlws"
)

// Public constants
const (
	AuthLoginCallbackEndpoint = "/auth/callback"
	AuthLoginErrorEndpoint    = "/auth/error"
	AuthLoginSuccessEndpoint  = "/"
)

// Private constants
const (
	ssoEndpoint                           = "/sso"
	apiServerEndpoint                     = "/api/"
	builderAPIEndpoint                    = "/builder/"
	monitoringEndpoint                    = "/monitoring-api/"
	clusterAPIEndpoint                    = "/cluster-api/"
	alarmAPIEndpoint                      = "/alarm-api/"
	metricAPIEndpoint                     = "/metric-api/"
	backupAPIEndpoint                     = "/backup-api/"
	packageAPIEndpoint                    = "/apis/package/"
	clusterManagementAPIEndpoint1         = "/sm/"
	clusterManagementAPIEndpoint2         = "/v1alpha1/"
	dashboardServerEndpoint               = "/dashboard/env"
	accountManagementEndpoint             = "/api/accounts_mgmt/"
	alertManagerProxyEndpoint             = "/api/alertmanager"
	alertManagerTenancyProxyEndpoint      = "/api/alertmanager-tenancy"
	alertmanagerUserWorkloadProxyEndpoint = "/api/alertmanager-user-workload"
	authLoginEndpoint                     = "/sso/login"
	authLogoutEndpoint                    = "/sso/logout"
	catalogdEndpoint                      = "/api/catalogd/"
	customLogoEndpoint                    = "/custom-logo"
	devfileEndpoint                       = "/api/devfile/"
	devfileSamplesEndpoint                = "/api/devfile/samples/"
	gitopsEndpoint                        = "/api/gitops/"
	graphQLEndpoint                       = "/api/graphql"
	helmChartRepoProxyEndpoint            = "/api/helm/charts/"
	indexPageTemplateName                 = "index.html"
	k8sProxyEndpoint                      = "/api/kubernetes/"
	knativeProxyEndpoint                  = "/api/console/knative/"
	devConsoleEndpoint                    = "/api/dev-console/"
	localesEndpoint                       = "/locales/resource.json"
	packageManifestEndpoint               = "/api/check-package-manifest/"
	operandsListEndpoint                  = "/api/list-operands/"
	pluginAssetsEndpoint                  = "/api/plugins/"
	pluginProxyEndpoint                   = "/api/proxy/"
	prometheusProxyEndpoint               = "/api/prometheus"
	prometheusTenancyProxyEndpoint        = "/api/prometheus-tenancy"
	copyLoginEndpoint                     = "/api/copy-login-commands"
	sha256Prefix                          = "sha256~"
	tokenizerPageTemplateName             = "tokener.html"
	updatesEndpoint                       = "/api/check-updates"
)

type jsGlobals struct {
	AddPage                         string                     `json:"addPage"`
	AlertManagerBaseURL             string                     `json:"alertManagerBaseURL"`
	AlertManagerPublicURL           string                     `json:"alertManagerPublicURL"`
	AlertmanagerUserWorkloadBaseURL string                     `json:"alertmanagerUserWorkloadBaseURL"`
	AuthDisabled                    bool                       `json:"authDisabled"`
	BasePath                        string                     `json:"basePath"`
	Branding                        string                     `json:"branding"`
	ConsolePlugins                  []string                   `json:"consolePlugins"`
	ConsoleVersion                  string                     `json:"consoleVersion"`
	ControlPlaneTopology            string                     `json:"controlPlaneTopology"`
	CopiedCSVsDisabled              bool                       `json:"copiedCSVsDisabled"`
	CustomLogoURL                   string                     `json:"customLogoURL"`
	CustomProductName               string                     `json:"customProductName"`
	DevCatalogCategories            string                     `json:"developerCatalogCategories"`
	DevCatalogTypes                 string                     `json:"developerCatalogTypes"`
	DocumentationBaseURL            string                     `json:"documentationBaseURL"`
	GOARCH                          string                     `json:"GOARCH"`
	GOOS                            string                     `json:"GOOS"`
	GrafanaPublicURL                string                     `json:"grafanaPublicURL"`
	GraphQLBaseURL                  string                     `json:"graphqlBaseURL"`
	I18nNamespaces                  []string                   `json:"i18nNamespaces"`
	InactivityTimeout               int                        `json:"inactivityTimeout"`
	KubeAdminLogoutURL              string                     `json:"kubeAdminLogoutURL"`
	KubeAPIServerURL                string                     `json:"kubeAPIServerURL"`
	LoadTestFactor                  int                        `json:"loadTestFactor"`
	LoginErrorURL                   string                     `json:"loginErrorURL"`
	LoginSuccessURL                 string                     `json:"loginSuccessURL"`
	LoginURL                        string                     `json:"loginURL"`
	LogoutRedirect                  string                     `json:"logoutRedirect"`
	LogoutURL                       string                     `json:"logoutURL"`
	NodeArchitectures               []string                   `json:"nodeArchitectures"`
	NodeOperatingSystems            []string                   `json:"nodeOperatingSystems"`
	Perspectives                    string                     `json:"perspectives"`
	ProjectAccessClusterRoles       string                     `json:"projectAccessClusterRoles"`
	PrometheusBaseURL               string                     `json:"prometheusBaseURL"`
	PrometheusPublicURL             string                     `json:"prometheusPublicURL"`
	PrometheusTenancyBaseURL        string                     `json:"prometheusTenancyBaseURL"`
	QuickStarts                     string                     `json:"quickStarts"`
	ReleaseVersion                  string                     `json:"releaseVersion"`
	StatuspageID                    string                     `json:"statuspageID"`
	Telemetry                       serverconfig.MultiKeyValue `json:"telemetry"`
	ThanosPublicURL                 string                     `json:"thanosPublicURL"`
	UserSettingsLocation            string                     `json:"userSettingsLocation"`
	K8sMode                         string                     `json:"k8sMode"`
	Capabilities                    []operatorv1.Capability    `json:"capabilities"`
}

type Server struct {
	APIServerProxyConfig            *proxy.Config
	MonitoringProxyConfig           *proxy.Config
	ClusterAPIProxyConfig           *proxy.Config
	AlarmAPIProxyConfig             *proxy.Config
	MetricAPIProxyConfig            *proxy.Config
	BackupAPIProxyConfig            *proxy.Config
	PackageAPIProxyConfig           *proxy.Config
	ClusterManagementAPIProxyConfig *proxy.Config

	AddPage                            string
	AuthDisabled                       bool
	Authenticator                      auth.Authenticator
	BaseURL                            *url.URL
	Branding                           string
	CatalogdProxyConfig                *proxy.Config
	ClusterManagementProxyConfig       *proxy.Config
	CookieEncryptionKey                []byte
	CookieAuthenticationKey            []byte
	ContentSecurityPolicy              string
	ControlPlaneTopology               string
	CopiedCSVsDisabled                 bool
	CSRFVerifier                       *csrfverifier.CSRFVerifier
	CustomLogoFile                     string
	CustomProductName                  string
	DevCatalogCategories               string
	DevCatalogTypes                    string
	DocumentationBaseURL               *url.URL
	EnabledConsolePlugins              serverconfig.MultiKeyValue
	GitOpsProxyConfig                  *proxy.Config
	GOARCH                             string
	GOOS                               string
	GrafanaPublicURL                   *url.URL
	I18nNamespaces                     []string
	InactivityTimeout                  int
	InternalProxiedK8SClientConfig     *rest.Config
	AnonymousInternalProxiedK8SRT      http.RoundTripper
	K8sMode                            string
	K8sProxyConfig                     *proxy.Config
	KnativeChannelCRDLister            ResourceLister
	KnativeEventSourceCRDLister        ResourceLister
	KubeAPIServerURL                   string // JS global only. Not used for proxying.
	KubeVersion                        string
	LoadTestFactor                     int
	MonitoringDashboardConfigMapLister ResourceLister
	NodeArchitectures                  []string
	NodeOperatingSystems               []string
	Perspectives                       string
	Capabilities                       []operatorv1.Capability
	PluginProxy                        string
	PluginsProxyTLSConfig              *tls.Config
	ProjectAccessClusterRoles          string
	PrometheusPublicURL                *url.URL
	PublicDir                          string
	QuickStarts                        string
	ReleaseVersion                     string
	ServiceClient                      *http.Client
	StatuspageID                       string
	TectonicVersion                    string
	Telemetry                          serverconfig.MultiKeyValue
	TerminalProxyTLSConfig             *tls.Config
	UserSettingsLocation               string
}

func disableDirectoryListing(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// If the request is for a directory, return a 404.
		// Directory path is expected to end with a slash or be empty,
		// since we are stripping the '/static/' prefix from the path.
		if strings.HasSuffix(r.URL.Path, "/") || r.URL.Path == "" {

			http.NotFound(w, r)
			return
		}
		handler.ServeHTTP(w, r)
	})
}

func (s *Server) gitopsProxyEnabled() bool {
	return s.GitOpsProxyConfig != nil
}

func (s *Server) HTTPHandler() (http.Handler, error) {
	if s.Authenticator == nil {
		return s.NoAuthConfiguredHandler(), nil
	}

	mux := http.NewServeMux()
	k8sProxy := proxy.NewProxy(s.K8sProxyConfig)
	handle := func(path string, handler http.Handler) {
		mux.Handle(proxy.SingleJoiningSlash(s.BaseURL.Path, path), handler)
	}

	handleFunc := func(path string, handler http.HandlerFunc) { handle(path, handler) }

	fn := func(successURL string, w http.ResponseWriter) {
		templateData := struct {
			LoginSuccessURL   string `json:"loginSuccessURL"`
			Branding          string `json:"branding"`
			CustomProductName string `json:"customProductName"`
		}{
			LoginSuccessURL:   successURL,
			Branding:          s.Branding,
			CustomProductName: s.CustomProductName,
		}

		tpl := template.New(tokenizerPageTemplateName)
		tpl.Delims("[[", "]]")
		tpls, err := tpl.ParseFiles(path.Join(s.PublicDir, tokenizerPageTemplateName))
		if err != nil {
			fmt.Printf("%v not found in configured public-dir path: %v", tokenizerPageTemplateName, err)
			os.Exit(1)
		}

		if err := tpls.ExecuteTemplate(w, tokenizerPageTemplateName, templateData); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}

	authenticator := s.Authenticator
	authHandler := func(h http.HandlerFunc) http.HandlerFunc {
		return authMiddleware(authenticator, s.CSRFVerifier, h)
	}

	authHandlerWithUser := func(h HandlerWithUser) http.HandlerFunc {
		return authMiddlewareWithUser(authenticator, s.CSRFVerifier, h)
	}
	handleFunc(authLoginEndpoint, s.Authenticator.LoginFunc)
	handleFunc(authLogoutEndpoint, allowMethod(http.MethodPost, s.handleLogout))
	handleFunc(AuthLoginCallbackEndpoint, s.Authenticator.CallbackFunc(fn))
	handle(copyLoginEndpoint, authHandler(s.handleCopyLogin))

	//handleFunc("/api/", notFoundHandler)

	handleFunc(ssoEndpoint, ssoFoundHandler)
	handleFunc(dashboardServerEndpoint, dashboardFoundHandler)

	staticHandler := http.StripPrefix(proxy.SingleJoiningSlash(s.BaseURL.Path, "/static/"), disableDirectoryListing(http.FileServer(http.Dir(s.PublicDir))))
	handle("/static/", gzipHandler(securityHeadersMiddleware(staticHandler)))

	if s.CustomLogoFile != "" {
		handleFunc(customLogoEndpoint, func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, s.CustomLogoFile)
		})
	}

	// Scope of Service Worker needs to be higher than the requests it is intercepting (https://stackoverflow.com/a/35780776/6909941)
	handleFunc("/load-test.sw.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, path.Join(s.PublicDir, "load-test.sw.js"))
	})

	handleFunc("/health", health.Checker{
		Checks: []health.Checkable{},
	}.ServeHTTP)

	handle(catalogdEndpoint, s.CatalogdHandler())

	handle(k8sProxyEndpoint, http.StripPrefix(
		proxy.SingleJoiningSlash(s.BaseURL.Path, k8sProxyEndpoint),
		authHandler(k8sProxy.ServeHTTP),
	))

	/*terminalProxy := terminal.NewProxy(
		s.TerminalProxyTLSConfig,
		s.K8sProxyConfig.TLSClientConfig,
		s.K8sProxyConfig.Endpoint)

	handle(terminal.ProxyEndpoint, authHandlerWithUser(terminalProxy.HandleProxy))
	handleFunc(terminal.AvailableEndpoint, terminalProxy.HandleProxyEnabled)
	handleFunc(terminal.InstalledNamespaceEndpoint, terminalProxy.HandleTerminalInstalledNamespace)*/

	graphQLSchema, err := ioutil.ReadFile("pkg/graphql/schema.graphql")
	if err != nil {
		panic(err)
	}
	opts := []graphql.SchemaOpt{graphql.UseFieldResolvers()}
	k8sResolver := resolver.K8sResolver{K8sProxy: k8sProxy}
	rootResolver := resolver.RootResolver{K8sResolver: &k8sResolver}
	schema := graphql.MustParseSchema(string(graphQLSchema), &rootResolver, opts...)
	handler := graphqlws.NewHandler()
	handler.InitPayload = resolver.InitPayload
	graphQLHandler := handler.NewHandlerFunc(schema, &relay.Handler{Schema: schema})
	handle("/api/graphql", authHandlerWithUser(func(user *auth.User, w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(context.Background(), resolver.HeadersKey, map[string]string{
			"Authorization": fmt.Sprintf("Bearer %s", user.Token),
		})
		graphQLHandler(w, r.WithContext(ctx))
	}))

	apiServerProxy := proxy.NewProxy(s.APIServerProxyConfig)
	handle(apiServerEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(apiServerProxy.ServeHTTP)),
	)
	handle("/terminal/", http.StripPrefix(
		s.BaseURL.Path,
		authHandler(apiServerProxy.ServeHTTP)),
	)

	/*handle("/ws", http.StripPrefix(
		s.BaseURL.Path,
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			apiServerProxy.ServeHTTP(w, r)
		})),
	)*/

	handle(builderAPIEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(apiServerProxy.ServeHTTP)),
	)

	monitoringProxy := proxy.NewProxy(s.MonitoringProxyConfig)
	handle(monitoringEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(monitoringProxy.ServeHTTP)),
	)

	clusterAPIProxy := proxy.NewProxy(s.ClusterAPIProxyConfig)
	handle(clusterAPIEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(clusterAPIProxy.ServeHTTP)),
	)

	alarmAPIProxy := proxy.NewProxy(s.AlarmAPIProxyConfig)
	handle(alarmAPIEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(alarmAPIProxy.ServeHTTP)),
	)

	metricAPIProxy := proxy.NewProxy(s.MetricAPIProxyConfig)
	handle(metricAPIEndpoint, http.StripPrefix(
		proxy.SingleJoiningSlash(s.BaseURL.Path, metricAPIEndpoint),
		authHandler(metricAPIProxy.ServeHTTP)),
	)

	backupAPIProxy := proxy.NewProxy(s.BackupAPIProxyConfig)
	handle(backupAPIEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(backupAPIProxy.ServeHTTP)),
	)

	packageAPIProxy := proxy.NewProxy(s.PackageAPIProxyConfig)
	handle(packageAPIEndpoint, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(packageAPIProxy.ServeHTTP)),
	)

	clusterManagementAPIProxy1 := proxy.NewProxy(s.ClusterManagementAPIProxyConfig)
	handle(clusterManagementAPIEndpoint1, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(clusterManagementAPIProxy1.ServeHTTP)),
	)
	clusterManagementAPIProxy2 := proxy.NewProxy(s.ClusterManagementAPIProxyConfig)
	handle(clusterManagementAPIEndpoint2, http.StripPrefix(
		s.BaseURL.Path,
		authHandler(clusterManagementAPIProxy2.ServeHTTP)),
	)

	handle("/api/console/monitoring-dashboard-config", authHandler(s.handleMonitoringDashboardConfigmaps))

	// Dev-Console Proxy
	handle(devConsoleEndpoint, http.StripPrefix(
		proxy.SingleJoiningSlash(s.BaseURL.Path, devConsoleEndpoint),
		authHandlerWithUser(func(user *auth.User, w http.ResponseWriter, r *http.Request) {
			devconsoleProxy.Handler(user, w, r)
		})),
	)

	// Plugins
	pluginsHandler := plugins.NewPluginsHandler(
		&http.Client{
			// 120 seconds matches the webpack require timeout.
			// Plugins are loaded asynchronously, so this doesn't block page load.
			Timeout:   120 * time.Second,
			Transport: &http.Transport{TLSClientConfig: s.PluginsProxyTLSConfig},
		},
		s.EnabledConsolePlugins,
		s.PublicDir,
	)

	handleFunc(localesEndpoint, func(w http.ResponseWriter, r *http.Request) {
		pluginsHandler.HandleI18nResources(w, r)
	})

	handle(pluginAssetsEndpoint, http.StripPrefix(
		proxy.SingleJoiningSlash(s.BaseURL.Path, pluginAssetsEndpoint),
		authHandler(func(w http.ResponseWriter, r *http.Request) {
			pluginsHandler.HandlePluginAssets(w, r)
		}),
	))

	if len(s.PluginProxy) != 0 {
		proxyConfig, err := plugins.ParsePluginProxyConfig(s.PluginProxy)
		if err != nil {
			klog.Fatalf("Error parsing plugin proxy config: %s", err)
			os.Exit(1)
		}
		proxyServiceHandlers, err := plugins.GetPluginProxyServiceHandlers(proxyConfig, s.PluginsProxyTLSConfig, pluginProxyEndpoint)
		if err != nil {
			klog.Fatalf("Error getting plugin proxy handlers: %s", err)
			os.Exit(1)
		}
		if len(proxyServiceHandlers) != 0 {
			klog.Infoln("The following console endpoints are now proxied to these services:")
		}
		for _, proxyServiceHandler := range proxyServiceHandlers {
			klog.Infof(" - %s -> %s\n", proxyServiceHandler.ConsoleEndpoint, proxyServiceHandler.ProxyConfig.Endpoint)
			serviceProxy := proxy.NewProxy(proxyServiceHandler.ProxyConfig)
			f := func(w http.ResponseWriter, r *http.Request) {
				serviceProxy.ServeHTTP(w, r)
			}
			var h http.Handler
			if proxyServiceHandler.Authorize {
				h = authHandler(f)
			} else {
				h = http.HandlerFunc(f)
			}
			handle(proxyServiceHandler.ConsoleEndpoint, http.StripPrefix(
				proxy.SingleJoiningSlash(s.BaseURL.Path, proxyServiceHandler.ConsoleEndpoint),
				h,
			))
		}
	}

	handle(updatesEndpoint, authHandler(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			w.Header().Set("Allow", "GET")
			serverutils.SendResponse(w, http.StatusMethodNotAllowed, serverutils.ApiError{Err: "Method unsupported, the only supported methods is GET"})
			return
		}
		serverutils.SendResponse(w, http.StatusOK, struct {
			ConsoleCommit string                  `json:"consoleCommit"`
			Plugins       []string                `json:"plugins"`
			Capabilities  []operatorv1.Capability `json:"capabilities,omitempty"`
		}{
			ConsoleCommit: os.Getenv("SOURCE_GIT_COMMIT"),
			Plugins:       pluginsHandler.GetPluginsList(),
			Capabilities:  s.Capabilities,
		})
	}))

	// GitOps proxy endpoints
	if s.gitopsProxyEnabled() {
		gitopsProxy := proxy.NewProxy(s.GitOpsProxyConfig)
		handle(gitopsEndpoint, http.StripPrefix(
			proxy.SingleJoiningSlash(s.BaseURL.Path, gitopsEndpoint),
			authHandler(gitopsProxy.ServeHTTP),
		))
	}

	handle("/api/console/version", authHandler(s.versionHandler))

	mux.HandleFunc(s.BaseURL.Path, s.indexHandler)

	return securityHeadersMiddleware(http.Handler(mux)), nil
}

func (s *Server) handleMonitoringDashboardConfigmaps(w http.ResponseWriter, r *http.Request) {
	s.MonitoringDashboardConfigMapLister.HandleResources(w, r)
}

func (s *Server) handleKnativeEventSourceCRDs(w http.ResponseWriter, r *http.Request) {
	s.KnativeEventSourceCRDLister.HandleResources(w, r)
}

func (s *Server) handleKnativeChannelCRDs(w http.ResponseWriter, r *http.Request) {
	s.KnativeChannelCRDLister.HandleResources(w, r)
}

func (s *Server) indexHandler(w http.ResponseWriter, r *http.Request) {
	if serverutils.IsUnsupportedBrowser(r) {
		serverutils.SendUnsupportedBrowserResponse(w, s.Branding)
		return
	}

	indexPageScriptNonce, err := utils.RandomString(32)
	if err != nil {
		panic(err)
	}

	contentSecurityPolicy, err := utils.BuildCSPDirectives(s.K8sMode, s.ContentSecurityPolicy, indexPageScriptNonce)
	if err != nil {
		klog.Fatalf("Error building Content Security Policy directives: %s", err)
		os.Exit(1)
	}

	w.Header().Set("Content-Security-Policy-Report-Only", strings.Join(contentSecurityPolicy, "; "))

	plugins := make([]string, 0, len(s.EnabledConsolePlugins))
	for plugin := range s.EnabledConsolePlugins {
		plugins = append(plugins, plugin)
	}

	jsg := &jsGlobals{
		AuthDisabled:              s.Authenticator.IsStatic(),
		ConsoleVersion:            version.Version,
		BasePath:                  s.BaseURL.Path,
		LoginURL:                  proxy.SingleJoiningSlash(s.BaseURL.String(), authLoginEndpoint),
		LoginSuccessURL:           proxy.SingleJoiningSlash(s.BaseURL.String(), AuthLoginSuccessEndpoint),
		LoginErrorURL:             proxy.SingleJoiningSlash(s.BaseURL.String(), AuthLoginErrorEndpoint),
		LogoutURL:                 authLogoutEndpoint,
		LogoutRedirect:            s.Authenticator.LogoutRedirectURL(),
		KubeAdminLogoutURL:        s.Authenticator.GetSpecialURLs().KubeAdminLogout,
		KubeAPIServerURL:          s.KubeAPIServerURL,
		Branding:                  s.Branding,
		CustomProductName:         s.CustomProductName,
		ControlPlaneTopology:      s.ControlPlaneTopology,
		StatuspageID:              s.StatuspageID,
		InactivityTimeout:         s.InactivityTimeout,
		DocumentationBaseURL:      s.DocumentationBaseURL.String(),
		GOARCH:                    s.GOARCH,
		GOOS:                      s.GOOS,
		LoadTestFactor:            s.LoadTestFactor,
		GraphQLBaseURL:            proxy.SingleJoiningSlash(s.BaseURL.Path, graphQLEndpoint),
		DevCatalogCategories:      s.DevCatalogCategories,
		DevCatalogTypes:           s.DevCatalogTypes,
		UserSettingsLocation:      s.UserSettingsLocation,
		ConsolePlugins:            plugins,
		I18nNamespaces:            s.I18nNamespaces,
		QuickStarts:               s.QuickStarts,
		AddPage:                   s.AddPage,
		ProjectAccessClusterRoles: s.ProjectAccessClusterRoles,
		Perspectives:              s.Perspectives,
		Telemetry:                 s.Telemetry,
		ReleaseVersion:            s.ReleaseVersion,
		NodeArchitectures:         s.NodeArchitectures,
		NodeOperatingSystems:      s.NodeOperatingSystems,
		CopiedCSVsDisabled:        s.CopiedCSVsDisabled,
		K8sMode:                   s.K8sMode,
		Capabilities:              s.Capabilities,
	}

	s.CSRFVerifier.SetCSRFCookie(s.BaseURL.Path, w)

	if s.CustomLogoFile != "" {
		jsg.CustomLogoURL = proxy.SingleJoiningSlash(s.BaseURL.Path, customLogoEndpoint)
	}

	templateData := struct {
		ServerFlags *jsGlobals
		ScriptNonce string
	}{
		ServerFlags: jsg,
		ScriptNonce: indexPageScriptNonce,
	}

	tpl := template.New(indexPageTemplateName)
	tpl.Delims("[[", "]]")
	tpls, err := tpl.ParseFiles(path.Join(s.PublicDir, indexPageTemplateName))
	if err != nil {
		fmt.Printf("index.html not found in configured public-dir path: %v", err)
		os.Exit(1)
	}

	if err := tpls.ExecuteTemplate(w, indexPageTemplateName, templateData); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (s *Server) versionHandler(w http.ResponseWriter, r *http.Request) {
	serverutils.SendResponse(w, http.StatusOK, struct {
		Version string `json:"version"`
	}{
		Version: version.Version,
	})
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("not found"))
}

func ssoFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{\n    \"status\": \"ok\",\n    \"keycloak\": false,\n    \"loginUrl\": \"\",\n    \"redirectUri\": \"/finish/keycloak\",\n    \"useRedis\": true,\n    \"token\": false\n}"))
}

func dashboardFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{\"title\":\"Cocktail\",\"my_host\":\"dashboard\",\"my_port\":\"3000\",\"closedNetwork\":false}"))
}

func (s *Server) handleCopyLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		serverutils.SendResponse(w, http.StatusMethodNotAllowed, serverutils.ApiError{Err: "Invalid method: only GET is allowed"})
		return
	}

	specialAuthURLs := s.Authenticator.GetSpecialURLs()

	serverutils.SendResponse(w, http.StatusOK, struct {
		RequestTokenURL      string `json:"requestTokenURL"`
		ExternalLoginCommand string `json:"externalLoginCommand"`
	}{
		RequestTokenURL: specialAuthURLs.RequestToken,
	})
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	s.CSRFVerifier.WithCSRFVerification(http.HandlerFunc(s.Authenticator.LogoutFunc)).ServeHTTP(w, r)
}

func (s *Server) NoAuthConfiguredHandler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprint(w, "Please configure authentication to use the web console.")
	}))
	return securityHeadersMiddleware(mux)
}

func (s *Server) CatalogdHandler() http.Handler {
	if s.CatalogdProxyConfig == nil {
		return http.NotFoundHandler()
	}
	catalogdProxy := proxy.NewProxy(s.CatalogdProxyConfig)
	return http.StripPrefix(
		proxy.SingleJoiningSlash(s.BaseURL.Path, catalogdEndpoint),
		catalogdProxy,
	)
}

const HeadersKey string = "headers"

func contextToHeaders(ctx context.Context, request *http.Request) {
	if ctx.Value(HeadersKey) != nil {
		headers, ok := ctx.Value(HeadersKey).(map[string]string)
		if ok {
			for key, value := range headers {
				if value != "" {
					request.Header.Add(key, value)
				}
			}
		}
	}
}
