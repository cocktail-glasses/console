package kubeconfig

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/headlamp-k8s/headlamp/backend/pkg/logger"
	"io"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
	"net/http"
	"strings"
	"time"
)

var (
	cocktailAPIHost             = "http://api-server:8080"
	GetClusterInfoFromApiServer = "api/monitoring/v2/info"
	QueryParamOnlyCluster       = "includeCluster=true"
)

// LoadAndWatchFiles loads kubeconfig files and watches them for changes.
func LoadCocktailApi(kubeConfigStore ContextStore) {

	var errs []error

	c, err := callClusterInfo()
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "cocktail api call error")
		return
	}
	name := "acloud-client"
	for k, v := range c {
		caCrt, _ := base64.StdEncoding.DecodeString(v.ServerAuthData)
		clientCrt, _ := base64.StdEncoding.DecodeString(v.ClientAuthData)
		clientKey, _ := base64.StdEncoding.DecodeString(v.ClientKeyData)
		config := GetConfig(name, name, name, v.APIUrl, caCrt, clientCrt, clientKey, "")

		for contextName, context := range config.Contexts {
			cluster := config.Clusters[context.Cluster]
			if cluster == nil {
				errs = append(errs, fmt.Errorf("cluster not found for context: %q", contextName))
				continue
			}

			// Note: nil authInfo is valid as authInfo can be provided by token.
			authInfo := config.AuthInfos[context.AuthInfo]

			context := Context{
				Name:        k,
				KubeContext: context,
				Cluster:     cluster,
				AuthInfo:    authInfo,
				AccountSeq:  v.Account.AccountSeq,
			}
			//err := context.SetupProxy()
			//if err != nil {
			//	errs = append(errs, fmt.Errorf("couldnt setup proxy for context: %q, err:%q", contextName, err))
			//	continue
			//}
			err = kubeConfigStore.AddContext(&context)
			if err != nil {
				errs = append(errs, err)
			}
		}
	}
	if len(errs) > 0 {
		logger.Log(logger.LevelError, nil, errors.Join(errs...), "cocktail api load config error")
	}
	return
}

func GetConfig(contextName, clusterName, authName, endpoint string, caCrt, clientCrt, cliKey []byte, token string) clientcmdapi.Config {
	authInfo := map[string]*clientcmdapi.AuthInfo{}

	if token == "" {
		authInfo = map[string]*clientcmdapi.AuthInfo{
			authName: {
				ClientCertificateData: []byte(clientCrt),
				ClientKeyData:         []byte(cliKey),
			},
		}

	} else {
		authInfo = map[string]*clientcmdapi.AuthInfo{
			authName: {
				Token: token,
			},
		}
	}

	config := clientcmdapi.Config{
		Kind:       "Config",
		APIVersion: "v1",
		Clusters: map[string]*clientcmdapi.Cluster{
			clusterName: {
				Server:                   endpoint,
				CertificateAuthorityData: []byte(caCrt),
			},
		},
		Contexts: map[string]*clientcmdapi.Context{
			contextName: {AuthInfo: authName, Cluster: clusterName},
		},
		CurrentContext: contextName,
		AuthInfos:      authInfo,
	}

	return config
}

func generateUrl(cocktailAPIHost string, getCocktailInfoOption string) string {
	// cocktail API 주소 뒤에 붙은 /를 제거한다.
	cocktailAPIUrl := strings.TrimSuffix(cocktailAPIHost, "/")

	api := fmt.Sprintf("%s/%s?%s", cocktailAPIUrl, GetClusterInfoFromApiServer, getCocktailInfoOption)
	// 웹 스키마가 없는 경우 추가해준다.
	if !strings.HasPrefix(api, "http://") && !strings.HasPrefix(api, "https://") {
		api = "http://" + api
	}

	return api
}

type ClusterInfo struct {
	ClusterSeq           int                    `json:"clusterSeq,omitempty"`
	ClusterName          string                 `json:"clusterName,omitempty"`
	ClusterId            string                 `json:"clusterId,omitempty"`
	ProviderCode         string                 `json:"providerCode,omitempty"`
	ProviderCodeName     string                 `json:"providerCodeName,omitempty"`
	ProviderName         string                 `json:"providerName,omitempty"`
	CubeType             string                 `json:"cubeType,omitempty"`
	APIUrl               string                 `json:"aPIUrl,omitempty"`
	APISecret            string                 `json:"aPISecret,omitempty"`
	AuthType             string                 `json:"authType,omitempty"`
	ServerAuthData       string                 `json:"serverAuthData,omitempty"`
	ClientAuthData       string                 `json:"clientAuthData,omitempty"`
	ClientKeyData        string                 `json:"clientKeyData,omitempty"`
	ClusterState         string                 `json:"clusterState"`
	K8sVersion           string                 `json:"k8sVersion"`
	CloudProviderAccount map[string]interface{} `json:"cloudProviderAccount"`
	Account              AccountInfo            `json:"account"`
	// Provider 를 위한 컨트롤 클러스터 동기화를 위한 컬럼 추가 2023.12.21
	IsControlCluster   bool
	ControlClusterSeq  int    `json:"controlClusterSeq,omitempty"`
	ControlClusterName string `json:"controlClusterName,omitempty"`
}

type AccountInfo struct {
	AccountSeq int `json:"accountSeq"`
}

func callClusterInfo() (map[string]*ClusterInfo, error) {
	clusters := make(map[string]*ClusterInfo)
	response, err := callHttpRequest(cocktailAPIHost, QueryParamOnlyCluster)
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "rest call and parse error")
		return nil, err
	}

	mapData := make(map[string]interface{})
	err = json.Unmarshal(response, &mapData)
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "parse to json error")
		return nil, err
	}

	if mapData["code"] != "200" {
		logger.Log(logger.LevelError, nil, mapData, "api-server error")
		return nil, err
	}

	result := mapData["result"].(map[string]interface{})

	// Read Clusters
	receivedClusters := result["clusters"].([]interface{})
	jsonByte, err := json.Marshal(receivedClusters)
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "re parse to json error (received cluster)")
		return nil, err
	}
	clusterList := make([]ClusterInfo, len(receivedClusters))
	err = json.Unmarshal(jsonByte, &clusterList)

	// for _, cluster := range clusterList {
	for i := 0; i < len(clusterList); i++ {
		cluster := clusterList[i]
		clusters[cluster.ClusterId] = &cluster
	}
	return clusters, nil
}

func callHttpRequest(cocktailAPIHost string, getCocktailInfoOption string) ([]byte, error) {
	query := generateUrl(cocktailAPIHost, getCocktailInfoOption)
	response, err := DoHttpReq(query, 10*time.Second, nil, nil)
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "rest call error:%v")
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(response.Body)

	if response.StatusCode != 200 {
		logger.Log(logger.LevelError, nil, err, "server send failed status code:%v")
		return nil, err
	}

	return io.ReadAll(response.Body)
}

func DoHttpReq(url string, timeout time.Duration, headers http.Header, body io.Reader) (*http.Response, error) {
	method := http.MethodGet
	if body != nil {
		method = http.MethodPost
	}
	req, err := buildReq(method, url, body, headers)
	if err != nil {
		return nil, err
	}
	c := getClient(timeout)
	return c.Do(req)
}

func buildReq(method, url string, body io.Reader, headers http.Header) (*http.Request, error) {
	req, err := http.NewRequest(method, url, body)
	if err == nil {
		for header, vals := range headers {
			for _, val := range vals {
				req.Header.Add(header, val)
			}
		}
	}
	return req, err
}

func getClient(timeout time.Duration) http.Client {
	Transporter := &http.Transport{
		MaxIdleConns:    1024,
		MaxConnsPerHost: 100,
		IdleConnTimeout: 10 * time.Second,
	}
	return http.Client{
		Transport: Transporter,
		Timeout:   timeout,
	}
}
