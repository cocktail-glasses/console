package server

import (
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/cocktailcloud/console/pkg/serverutils"

	"k8s.io/klog/v2"
)

// ResourceLister handles resource requests
type ResourceLister interface {
	HandleResources(w http.ResponseWriter, r *http.Request)
}

// FilterFunction shall filter response before propagating
type FilterFunction func(http.ResponseWriter, *http.Response)

// resourceLister determines the list of resources of a particular kind
type resourceLister struct {
	requestURL      *url.URL
	authenticatedRT http.RoundTripper
	responseFilter  FilterFunction
}

// HandleResources handles resource requests
func (l *resourceLister) HandleResources(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		serverutils.SendResponse(w, http.StatusMethodNotAllowed, serverutils.ApiError{Err: "invalid method: only GET is allowed"})
		return
	}

	req, err := http.NewRequest("GET", l.requestURL.String(), nil)
	if err != nil {
		serverutils.SendResponse(w, http.StatusInternalServerError, serverutils.ApiError{Err: fmt.Sprintf("failed to create GET request: %v", err)})
		return
	}

	resp, err := l.authenticatedRT.RoundTrip(req)
	if err != nil {
		serverutils.SendResponse(w, http.StatusBadGateway, serverutils.ApiError{Err: fmt.Sprintf("GET request failed: %v", err)})
		return
	}

	if resp.StatusCode != http.StatusOK {
		err := fmt.Errorf("console service account cannot list resource: %s", resp.Status)
		serverutils.SendResponse(w, resp.StatusCode, serverutils.ApiError{Err: err.Error()})
		return
	}

	w.WriteHeader(resp.StatusCode)
	l.responseFilter(w, resp)
	resp.Body.Close()
}

// NewResourceLister shall instantiate & return resourceLister instance
func NewResourceLister(requestURL *url.URL, authenticatedRT http.RoundTripper, respFilter FilterFunction) ResourceLister {
	r := &resourceLister{
		requestURL:      requestURL,
		authenticatedRT: authenticatedRT,
		responseFilter:  respFilter,
	}
	if r.responseFilter == nil {
		r.responseFilter = func(w http.ResponseWriter, r *http.Response) {
			if _, err := io.Copy(w, r.Body); err != nil {
				klog.Errorf("console service account cannot list resource: %s", err)
				serverutils.SendResponse(w.(http.ResponseWriter), http.StatusInternalServerError, serverutils.ApiError{Err: err.Error()})
			}
		}
	}

	return r
}
