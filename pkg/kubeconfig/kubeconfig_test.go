package kubeconfig_test

import (
	"context"
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const kubeConfigFilePath = "./test_data/kubeconfig1"

func TestLoadAndStoreKubeConfigs(t *testing.T) {
	contextStore := NewContextStore()

	t.Run("valid_file", func(t *testing.T) {
		kubeConfigFile := kubeConfigFilePath

		err := LoadAndStoreKubeConfigs(contextStore, kubeConfigFile, KubeConfig)
		require.NoError(t, err)

		contexts, err := contextStore.GetContexts()
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))

		ctx, err := contextStore.GetContext("minikube")
		require.NoError(t, err)

		require.Equal(t, "minikube", ctx.Name)
	})

	t.Run("invalid_file", func(t *testing.T) {
		kubeConfigFile := "invalid_kubeconfig"

		err := LoadAndStoreKubeConfigs(contextStore, kubeConfigFile, KubeConfig)
		require.Error(t, err)
	})
}

func TestLoadContextsFromKubeConfigFile(t *testing.T) {
	t.Run("valid_file", func(t *testing.T) {
		kubeConfigFile := kubeConfigFilePath

		contexts, err := LoadContextsFromFile(kubeConfigFile, KubeConfig)
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))
	})

	t.Run("invalid_file", func(t *testing.T) {
		kubeConfigFile := "invalid_kubeconfig"

		_, err := LoadContextsFromFile(kubeConfigFile, KubeConfig)
		require.Error(t, err)
	})
}

func TestContext(t *testing.T) {
	kubeConfigFile := config.GetDefaultKubeConfigPath()

	configStore := NewContextStore()

	err := LoadAndStoreKubeConfigs(configStore, kubeConfigFile, KubeConfig)
	require.NoError(t, err)

	testContext, err := configStore.GetContext("minikube")
	require.NoError(t, err)

	require.Equal(t, "minikube", testContext.Name)
	require.NotNil(t, testContext.ClientConfig())
	require.Equal(t, "default", testContext.KubeContext.Namespace)

	restConf, err := testContext.RESTConfig()
	require.NoError(t, err)
	require.NotNil(t, restConf)

	// Test proxy request handler

	request, err := http.NewRequestWithContext(context.Background(), "GET", "/version", nil)
	require.NoError(t, err)

	rr := httptest.NewRecorder()

	err = testContext.ProxyRequest(rr, request)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rr.Code)

	t.Logf("Proxy request Response: %s", rr.Body.String())
	assert.Contains(t, rr.Body.String(), "major")
	assert.Contains(t, rr.Body.String(), "minor")
}

func TestLoadContextsFromBase64String(t *testing.T) {
	t.Run("valid_base64", func(t *testing.T) {
		// Read the content of the kubeconfig file
		kubeConfigFile := kubeConfigFilePath
		kubeConfigContent, err := os.ReadFile(kubeConfigFile)
		require.NoError(t, err)

		// Encode the content using base64 encoding
		base64String := base64.StdEncoding.EncodeToString(kubeConfigContent)

		contexts, err := LoadContextsFromBase64String(base64String, DynamicCluster)
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))
		assert.Equal(t, DynamicCluster, contexts[0].Source)
	})

	t.Run("invalid_base64", func(t *testing.T) {
		invalidBase64String := "invalid_base64"
		source := 2

		_, err := LoadContextsFromBase64String(invalidBase64String, source)
		require.Error(t, err)
	})
}
