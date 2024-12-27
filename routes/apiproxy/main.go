package main

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

type Config struct {
	SmURL          string
	BdURL          string
	BkURL          string
	LogURL         string
	MonitorURL     string
	MetricAPIURL   string
	AlarmAPIURL    string
	MeteringURL    string
	ClusterAPIURL  string
	ClusterMgmtURL string
	ApmAPIURL      string
}

var config = Config{
	SmURL:          "http://sm_server:8080",
	BdURL:          "http://bd_server:8080",
	BkURL:          "http://bk_server:8080",
	LogURL:         "http://log_server:8080",
	MonitorURL:     "http://monitor_server:8080",
	MetricAPIURL:   "http://metric_api_server:8080",
	AlarmAPIURL:    "http://alarm_api_server:8080",
	MeteringURL:    "http://metering_server:8080",
	ClusterAPIURL:  "http://cluster_api_server:8080",
	ClusterMgmtURL: "http://cluster_mgmt_server:8080",
	ApmAPIURL:      "http://apm_server:8080",
}

func main() {
	router := mux.NewRouter()

	router.PathPrefix("/api/").Handler(createProxy(config.SmURL))
	router.PathPrefix("/builder/").Handler(createProxy(config.BdURL))
	router.PathPrefix("/backup-api/").Handler(createProxy(config.BkURL))
	router.PathPrefix("/monitoring-api/").Handler(createProxy(config.MonitorURL))
	router.PathPrefix("/log-api/").Handler(createProxy(config.LogURL))
	router.PathPrefix("/metric-api/").Handler(createProxy(config.MetricAPIURL))
	router.PathPrefix("/alarm-api/").Handler(createProxy(config.AlarmAPIURL))
	router.PathPrefix("/metering/").Handler(createProxy(config.MeteringURL))
	router.PathPrefix("/sm/").Handler(createProxy(config.ClusterMgmtURL))
	router.PathPrefix("/apm/").Handler(createProxy(config.ApmAPIURL))

	log.Fatal(http.ListenAndServe(":8080", router))
}

func createProxy(target string) http.Handler {
	targetURL, err := url.Parse(target)
	if err != nil {
		log.Fatalf("Invalid proxy target URL: %s", target)
	}
	proxy := httputil.NewSingleHostReverseProxy(targetURL)
	proxy.ModifyResponse = modifyResponse

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		modifyRequest(r)
		proxy.ServeHTTP(w, r)
	})
}

func modifyRequest(r *http.Request) {
	// Add custom headers if required
	r.Header.Set("Content-Type", "application/json;charset=UTF-8")
	// Example: Add user details from session (mocked here for demonstration)
	r.Header.Set("user-id", "mocked-user-id")
	r.Header.Set("user-role", "mocked-user-role")
}

func modifyResponse(resp *http.Response) error {
	// Example: Log the response or modify it as required
	if resp.StatusCode >= 400 {
		log.Printf("Error response: %s", resp.Status)
	}
	return nil
}
