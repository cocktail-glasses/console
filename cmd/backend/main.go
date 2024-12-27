package main

import (
	"crypto/tls"
	"crypto/x509"
	"flag"
	"fmt"
	authopts "github.com/cocktailcloud/console/cmd/backend/config/auth"
	"github.com/cocktailcloud/console/cmd/backend/config/session"
	"github.com/cocktailcloud/console/pkg/auth"
	"github.com/cocktailcloud/console/pkg/flags"
	"github.com/cocktailcloud/console/pkg/proxy"
	"github.com/cocktailcloud/console/pkg/server"
	"github.com/cocktailcloud/console/pkg/serverconfig"
	oscrypto "github.com/openshift/library-go/pkg/crypto"
	"k8s.io/client-go/rest"
	"k8s.io/klog/v2"
	"net/http"
	"net/url"
	"os"
	"runtime"
	"strings"
)

const (
	k8sInClusterCA          = "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
	k8sInClusterBearerToken = "/var/run/secrets/kubernetes.io/serviceaccount/token"

	apiServerURL       = "http://localhost:8080"
	dashboardServerURL = "http://localhost:3000"
)

func main() {
	fs := flag.NewFlagSet("backend", flag.ExitOnError)
	klog.InitFlags(fs)
	defer klog.Flush()

	authOptions := authopts.NewAuthOptions()
	authOptions.AddFlags(fs)

	sessionOptions := session.NewSessionOptions()
	sessionOptions.AddFlags(fs)

	// Define commandline / env / config options
	fs.String("config", "", "The YAML config file.")

	fListen := fs.String("listen", "http://0.0.0.0:8201", "")

	fBaseAddress := fs.String("base-address", "", "Format: <http | https>://domainOrIPAddress[:port]. Example: https://cocktailcloud.example.com.")
	fBasePath := fs.String("base-path", "/", "")

	// See https://github.com/openshift/service-serving-cert-signer
	fServiceCAFile := fs.String("service-ca-file", "", "CA bundle for OpenShift services signed with the service signing certificates.")

	fRedirectPort := fs.Int("redirect-port", 0, "Port number under which the console should listen for custom hostname redirect.")
	fLogLevel := fs.String("log-level", "", "level of logging information by package (pkg=level).")
	fPublicDir := fs.String("public-dir", "./frontend/public/dist", "directory containing static web assets.")
	fTlSCertFile := fs.String("tls-cert-file", "", "TLS certificate. If the certificate is signed by a certificate authority, the certFile should be the concatenation of the server's certificate followed by the CA's certificate.")
	fTlSKeyFile := fs.String("tls-key-file", "", "The TLS certificate key.")
	fCAFile := fs.String("ca-file", "", "PEM File containing trusted certificates of trusted CAs. If not present, the system's Root CAs will be used.")

	fK8sMode := fs.String("k8s-mode", "in-cluster", "in-cluster | off-cluster")
	fK8sModeOffClusterEndpoint := fs.String("k8s-mode-off-cluster-endpoint", "", "URL of the Kubernetes API server.")
	fK8sModeOffClusterSkipVerifyTLS := fs.Bool("k8s-mode-off-cluster-skip-verify-tls", false, "DEV ONLY. When true, skip verification of certs presented by k8s API server.")
	fK8sModeOffClusterCatalogd := fs.String("k8s-mode-off-cluster-catalogd", "", "DEV ONLY. URL of the cluster's catalogd server.")

	fDocumentationBaseURL := fs.String("documentation-base-url", "", "The base URL for documentation links.")

	fK8sPublicEndpoint := fs.String("k8s-public-endpoint", "", "Endpoint to use to communicate to the API server.")

	fBranding := fs.String("branding", "cocktail", "Console branding for the masthead logo and title. One of okd, openshift, ocp, online, dedicated, azure, or rosa. Defaults to okd.")
	fCustomLogoFile := fs.String("custom-logo-file", "", "Custom product image for console branding.")

	consolePluginsFlags := serverconfig.MultiKeyValue{}
	fs.Var(&consolePluginsFlags, "plugins", "List of plugin entries that are enabled for the console. Each entry consist of plugin-name as a key and plugin-endpoint as a value.")
	fPluginProxy := fs.String("plugin-proxy", "", "Defines various service types to which will console proxy plugins requests. (JSON as string)")

	cfg, err := serverconfig.Parse(fs, os.Args[1:], "BACKEND")
	if err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}

	if err := serverconfig.Validate(fs); err != nil {
		fmt.Fprintln(os.Stderr, err.Error())
		os.Exit(1)
	}

	authOptions.ApplyConfig(&cfg.Auth)
	sessionOptions.ApplyConfig(&cfg.Session)

	baseURL, err := flags.ValidateFlagIsURL("base-address", *fBaseAddress, true)
	flags.FatalIfFailed(err)

	if !strings.HasPrefix(*fBasePath, "/") || !strings.HasSuffix(*fBasePath, "/") {
		flags.FatalIfFailed(flags.NewInvalidFlagError("base-path", "value must start and end with slash"))
	}
	baseURL.Path = *fBasePath

	documentationBaseURL := &url.URL{}
	if *fDocumentationBaseURL != "" {
		if !strings.HasSuffix(*fDocumentationBaseURL, "/") {
			flags.FatalIfFailed(flags.NewInvalidFlagError("documentation-base-url", "value must end with slash"))
		}
		documentationBaseURL, err = flags.ValidateFlagIsURL("documentation-base-url", *fDocumentationBaseURL, false)
		flags.FatalIfFailed(err)
	}

	branding := *fBranding
	if branding == "cocktail" {
		branding = "cocktail"
	}
	switch branding {
	case "cocktail":
	case "cocktail-pipeline":
	case "cocktail-kaas":
	case "cocktail-online":
	default:
		flags.FatalIfFailed(flags.NewInvalidFlagError("branding", "value must be one of cocktail, cocktail-pipeline, cocktail-kaas, cocktail-online"))
	}

	if *fCustomLogoFile != "" {
		if _, err := os.Stat(*fCustomLogoFile); err != nil {
			klog.Fatalf("could not read logo file: %v", err)
		}
	}

	if len(consolePluginsFlags) > 0 {
		klog.Infoln("The following console plugins are enabled:")
		for pluginName := range consolePluginsFlags {
			klog.Infof(" - %s\n", pluginName)
		}
	}

	srv := &server.Server{
		PublicDir:             *fPublicDir,
		BaseURL:               baseURL,
		Branding:              branding,
		CustomLogoFile:        *fCustomLogoFile,
		DocumentationBaseURL:  documentationBaseURL,
		EnabledConsolePlugins: consolePluginsFlags,
		PluginProxy:           *fPluginProxy,
		K8sMode:               *fK8sMode,
	}
	completedAuthnOptions, err := authOptions.Complete()
	if err != nil {
		klog.Fatalf("failed to complete authentication options: %v", err)
		os.Exit(1)
	}

	completedSessionOptions, err := sessionOptions.Complete(completedAuthnOptions.AuthType)
	if err != nil {
		klog.Fatalf("failed to complete session options: %v", err)
		os.Exit(1)
	}

	// if !in-cluster (dev) we should not pass these values to the frontend
	// is used by catalog-utils.ts
	if *fK8sMode == "in-cluster" {
		srv.GOARCH = runtime.GOARCH
		srv.GOOS = runtime.GOOS
	}

	if *fLogLevel != "" {
		klog.Warningf("DEPRECATED: --log-level is now deprecated, use verbosity flag --v=Level instead")
	}
	var (
		// Hold on to raw certificates so we can render them in kubeconfig files.
		k8sCertPEM []byte
	)

	var k8sEndpoint *url.URL
	switch *fK8sMode {
	case "in-cluster":
		k8sEndpoint = &url.URL{Scheme: "https", Host: "kubernetes.default.svc"}
		var err error
		k8sCertPEM, err = os.ReadFile(k8sInClusterCA)
		if err != nil {
			klog.Fatalf("Error inferring Kubernetes config from environment: %v", err)
		}
		rootCAs := x509.NewCertPool()
		if !rootCAs.AppendCertsFromPEM(k8sCertPEM) {
			klog.Fatal("No CA found for the API server")
		}
		tlsConfig := oscrypto.SecureTLSConfig(&tls.Config{
			RootCAs: rootCAs,
		})

		srv.InternalProxiedK8SClientConfig = &rest.Config{
			Host:            k8sEndpoint.String(),
			BearerTokenFile: k8sInClusterBearerToken,
			TLSClientConfig: rest.TLSClientConfig{
				CAFile: k8sInClusterCA,
			},
		}

		srv.K8sProxyConfig = &proxy.Config{
			TLSClientConfig: tlsConfig,
			HeaderBlacklist: []string{"Cookie", "X-CSRFToken"},
			Endpoint:        k8sEndpoint,
		}

		// If running in an OpenShift cluster, set up a proxy to the prometheus-k8s service running in the openshift-monitoring namespace.
		if *fServiceCAFile != "" {
			serviceCertPEM, err := os.ReadFile(*fServiceCAFile)
			if err != nil {
				klog.Fatalf("failed to read service-ca.crt file: %v", err)
			}
			serviceProxyRootCAs := x509.NewCertPool()
			if !serviceProxyRootCAs.AppendCertsFromPEM(serviceCertPEM) {
				klog.Fatal("no CA found for Kubernetes services")
			}
			serviceProxyTLSConfig := oscrypto.SecureTLSConfig(&tls.Config{
				RootCAs: serviceProxyRootCAs,
			})

			srv.ServiceClient = &http.Client{
				Transport: &http.Transport{
					TLSClientConfig: serviceProxyTLSConfig,
				},
			}

			/*srv.CatalogdProxyConfig = &proxy.Config{
				TLSClientConfig: serviceProxyTLSConfig,
				Endpoint:        &url.URL{Scheme: "https", Host: catalogdHost},
			}

			srv.ThanosProxyConfig = &proxy.Config{
				TLSClientConfig: serviceProxyTLSConfig,
				HeaderBlacklist: []string{"Cookie", "X-CSRFToken"},
				Endpoint:        &url.URL{Scheme: "https", Host: openshiftThanosHost, Path: "/api"},
			}*/

			srv.TerminalProxyTLSConfig = serviceProxyTLSConfig
			srv.PluginsProxyTLSConfig = serviceProxyTLSConfig

		}

	case "off-cluster":
		k8sEndpoint, err = flags.ValidateFlagIsURL("k8s-mode-off-cluster-endpoint", *fK8sModeOffClusterEndpoint, false)
		flags.FatalIfFailed(err)

		serviceProxyTLSConfig := oscrypto.SecureTLSConfig(&tls.Config{
			InsecureSkipVerify: *fK8sModeOffClusterSkipVerifyTLS,
		})

		srv.ServiceClient = &http.Client{
			Transport: &http.Transport{
				TLSClientConfig: serviceProxyTLSConfig,
			},
		}

		srv.InternalProxiedK8SClientConfig = &rest.Config{
			Host:      k8sEndpoint.String(),
			Transport: &http.Transport{TLSClientConfig: serviceProxyTLSConfig},
		}

		srv.K8sProxyConfig = &proxy.Config{
			TLSClientConfig:         serviceProxyTLSConfig,
			HeaderBlacklist:         []string{"Cookie", "X-CSRFToken"},
			Endpoint:                k8sEndpoint,
			UseProxyFromEnvironment: true,
		}

		if *fK8sModeOffClusterCatalogd != "" {
			offClusterCatalogdURL, err := flags.ValidateFlagIsURL("k8s-mode-off-cluster-catalogd", *fK8sModeOffClusterCatalogd, false)
			flags.FatalIfFailed(err)
			srv.CatalogdProxyConfig = &proxy.Config{
				TLSClientConfig: serviceProxyTLSConfig,
				Endpoint:        offClusterCatalogdURL,
			}
		}

		srv.TerminalProxyTLSConfig = serviceProxyTLSConfig
		srv.PluginsProxyTLSConfig = serviceProxyTLSConfig

	default:
		flags.FatalIfFailed(flags.NewInvalidFlagError("k8s-mode", "must be one of: in-cluster, off-cluster"))
	}

	apiServerEndpoint := *fK8sPublicEndpoint
	if apiServerEndpoint == "" {
		apiServerEndpoint = srv.K8sProxyConfig.Endpoint.String()
	}
	srv.KubeAPIServerURL = apiServerEndpoint

	apiServerURL, err := url.Parse(apiServerURL)
	if err != nil {
		klog.Fatalf("failed to parse %q", apiServerURL)
	}
	srv.APIServerProxyConfig = &proxy.Config{
		TLSClientConfig: oscrypto.SecureTLSConfig(&tls.Config{}),
		HeaderBlacklist: []string{"Cookie", "X-CSRFToken"},
		Endpoint:        apiServerURL,
	}

	dashboardServerURL, err := url.Parse(dashboardServerURL)
	if err != nil {
		klog.Fatalf("failed to parse %q", dashboardServerURL)
	}
	srv.DashboardServerURL = &proxy.Config{
		TLSClientConfig: oscrypto.SecureTLSConfig(&tls.Config{}),
		HeaderBlacklist: []string{"Cookie", "X-CSRFToken"},
		Endpoint:        dashboardServerURL,
	}

	srv.AnonymousInternalProxiedK8SRT, err = rest.TransportFor(rest.AnonymousClientConfig(srv.InternalProxiedK8SClientConfig))
	if err != nil {
		klog.Fatalf("Failed to create anonymous k8s HTTP client: %v", err)
	}

	srv.AuthMetrics = auth.NewMetrics(srv.AnonymousInternalProxiedK8SRT)

	caCertFilePath := *fCAFile
	if *fK8sMode == "in-cluster" {
		caCertFilePath = k8sInClusterCA
	}

	if err := completedAuthnOptions.ApplyTo(srv, k8sEndpoint, caCertFilePath, completedSessionOptions); err != nil {
		klog.Fatalf("failed to apply configuration to server: %v", err)
		os.Exit(1)
	}

	listenURL, err := flags.ValidateFlagIsURL("listen", *fListen, false)
	flags.FatalIfFailed(err)

	switch listenURL.Scheme {
	case "http":
	case "https":
		flags.FatalIfFailed(flags.ValidateFlagNotEmpty("tls-cert-file", *fTlSCertFile))
		flags.FatalIfFailed(flags.ValidateFlagNotEmpty("tls-key-file", *fTlSKeyFile))
	default:
		flags.FatalIfFailed(flags.NewInvalidFlagError("listen", "scheme must be one of: http, https"))
	}

	consoleHandler, err := srv.HTTPHandler()
	if err != nil {
		klog.Errorf("failed to set up the console's HTTP handler: %v", err)
		os.Exit(1)
	}
	httpsrv := &http.Server{
		Addr:    listenURL.Host,
		Handler: consoleHandler,
		// Disable HTTP/2, which breaks WebSockets.
		TLSNextProto: make(map[string]func(*http.Server, *tls.Conn, http.Handler)),
		TLSConfig:    oscrypto.SecureTLSConfig(&tls.Config{}),
	}

	if *fRedirectPort != 0 {
		go func() {
			// Listen on passed port number to be redirected to the console
			redirectServer := http.NewServeMux()
			redirectServer.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
				redirectURL := &url.URL{
					Scheme:   srv.BaseURL.Scheme,
					Host:     srv.BaseURL.Host,
					RawQuery: req.URL.RawQuery,
					Path:     req.URL.Path,
				}
				http.Redirect(res, req, redirectURL.String(), http.StatusMovedPermanently)
			})
			redirectPort := fmt.Sprintf(":%d", *fRedirectPort)
			klog.Infof("Listening on %q for custom hostname redirect...", redirectPort)
			klog.Fatal(http.ListenAndServe(redirectPort, redirectServer))
		}()
	}

	klog.Infof("Binding to %s...", httpsrv.Addr)
	if listenURL.Scheme == "https" {
		klog.Info("using TLS")
		klog.Fatal(httpsrv.ListenAndServeTLS(*fTlSCertFile, *fTlSKeyFile))
	} else {
		klog.Info("not using TLS")
		klog.Fatal(httpsrv.ListenAndServe())
	}

}
