package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type Response struct {
	Code   int         `json:"code"`
	Status string      `json:"status"`
	Result interface{} `json:"result,omitempty"`
}

type ErrorResponse struct {
	Code   int    `json:"code"`
	Status string `json:"status"`
	Error  string `json:"error"`
}

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/stomp", StompHandler).Methods("POST")

	log.Fatal(http.ListenAndServe(":8080", router))
}

func StompHandler(w http.ResponseWriter, r *http.Request) {
	var requestBody map[string]interface{}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		writeErrorResponse(w, http.StatusInternalServerError, "Failed to read request body")
		return
	}
	if err := json.Unmarshal(body, &requestBody); err != nil {
		writeErrorResponse(w, http.StatusBadRequest, "Invalid JSON format")
		return
	}

	clientConnected := true // Simulated; replace with actual client status check
	userHeaders := extractHeaders(r)
	event := fmt.Sprintf("%v", requestBody["event"])
	target := requestBody["target"].(map[string]interface{})

	switch event {
	case "PL_RUN_STATE":
		handleRequest(fmt.Sprintf("%s/api/pl/%v", "<SM_URL>", target["plSeq"]), "@@pipeline/FETCH_PL_DETAIL_SUCCESS", userHeaders, clientConnected)
		handleRequest(fmt.Sprintf("%s/api/pl/%v/run/%v", "<SM_URL>", target["plSeq"], target["plRunSeq"]), "@@pipeline/FETCH_RUN_PIPELINE_DETAIL_SUCCESS", userHeaders, clientConnected)
		writeSuccessResponse(w, http.StatusOK)
	case "BUILD_STATE":
		handleRequest(fmt.Sprintf("%s/api/build?accountSeq=%v", "<BD_URL>", target["accountSeq"]), "@@build/FETCH_BUILD_LIST_SUCCESS", userHeaders, clientConnected)
		handleRequest(fmt.Sprintf("%s/api/build?accountSeq=%v&serviceSeq=%v", "<BD_URL>", target["accountSeq"], target["serviceSeq"]), "@@build/FETCH_BUILD_LIST_SUCCESS", userHeaders, clientConnected)
		writeSuccessResponse(w, http.StatusOK)
	default:
		writeErrorResponse(w, http.StatusBadRequest, "Unknown event type")
	}
}

func extractHeaders(r *http.Request) map[string]string {
	headers := map[string]string{
		"user-id":        r.Header.Get("user-id"),
		"user-role":      r.Header.Get("user-role"),
		"Content-Type":   "application/json;charset=UTF-8",
		"user-workspace": r.Header.Get("user-workspace"),
	}
	return headers
}

func handleRequest(url string, eventType string, headers map[string]string, clientConnected bool) {
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Failed to create request: %v", err)
		return
	}

	for key, value := range headers {
		if strings.TrimSpace(value) != "" {
			request.Header.Set(key, value)
		}
	}

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.Printf("Error making request to %s: %v", url, err)
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		return
	}

	if clientConnected {
		log.Printf("Event: %s, Response: %s", eventType, string(body))
	}
}

func writeSuccessResponse(w http.ResponseWriter, statusCode int) {
	response := Response{
		Code:   statusCode,
		Status: "success",
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func writeErrorResponse(w http.ResponseWriter, statusCode int, errorMessage string) {
	errorResponse := ErrorResponse{
		Code:   statusCode,
		Status: "error",
		Error:  errorMessage,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(errorResponse)
}
