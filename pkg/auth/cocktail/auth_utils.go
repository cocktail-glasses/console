package cocktail

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"sync"
)

var sessionLock sync.Mutex

func handleSuccessfulLogin(w http.ResponseWriter, r *http.Request, respData map[string]interface{}, loginPage string) {
	sessionLock.Lock()
	defer sessionLock.Unlock()

	content := respData
	user := content["result"].(map[string]interface{})
	content["result"].(map[string]interface{})["loginPage"] = loginPage

	// Encrypt the response body if necessary
	if r.Header.Get("encryption-body") == "a" {
		r, err := EncryptAES256CBC(toJSON(content["result"]), "cocktail-glasses_encryption_data", "cocktail-glasses")
		if err != nil {
			return

		}
		content["result"] = r
	} else if r.Header.Get("encryption-body") != "off" {
	} else {
		content["result"] = encryptAES(content["result"])
	}

	sess := make(map[string]interface{})
	if user["userRole"] != nil {
		sess["logged"] = true
		sess["userSeq"] = user["userSeq"]
		sess["userId"] = user["userId"]
		sess["userRole"] = user["userRole"]
		if user["lastServiceSeq"] != nil {
			sess["userWorkspace"] = user["lastServiceSeq"]
		}
		if account := user["account"]; account != nil {
			accountData := account.(map[string]interface{})
			sess["accountSeq"] = accountData["accountSeq"]
			sess["accountCode"] = accountData["accountCode"]

		}
		/*if USE_REDIS {
			redisClient.Set(r.Context(), fmt.Sprintf("sess:%s", r.Header.Get("sessionID")), toJSON(sess), 0)
		}*/
	} else {
		sess["logged"] = false
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(content)
}

func toJSON(data interface{}) string {
	bytes, _ := json.Marshal(data)
	return string(bytes)
}

func encryptAES(data interface{}) string {
	// Implement AES encryption here
	return toJSON(data)
}

// EncryptAES256CBC encrypts data using AES-256-CBC
func EncryptAES256CBC(data, key, iv string) (string, error) {
	// Convert key and IV to byte arrays
	keyBytes, err := parseKey(key)
	if err != nil {
		return "", err
	}
	ivBytes := []byte(iv)
	if len(ivBytes) != aes.BlockSize {
		return "", errors.New("IV length must be 16 bytes")
	}

	// Pad data to block size
	paddedData := pkcs7Pad([]byte(data), aes.BlockSize)
	if paddedData == nil {
		return "", errors.New("failed to pad data")
	}

	// Create AES block cipher
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", err
	}

	// Perform AES encryption
	cipherText := make([]byte, len(paddedData))
	mode := cipher.NewCBCEncrypter(block, ivBytes)
	mode.CryptBlocks(cipherText, paddedData)

	// Return Base64-encoded ciphertext
	return base64.StdEncoding.EncodeToString(cipherText), nil
}

// DecryptAES256CBC decrypts data using AES-256-CBC
func DecryptAES256CBC(data, key, iv string) (string, error) {
	// Convert key and IV to byte arrays
	keyBytes, err := parseKey(key)
	if err != nil {
		return "", err
	}
	ivBytes := []byte(iv)
	if len(ivBytes) != aes.BlockSize {
		return "", errors.New("IV length must be 16 bytes")
	}

	// Decode Base64-encoded ciphertext
	cipherText, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return "", err
	}

	// Create AES block cipher
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", err
	}

	// Perform AES decryption
	plainText := make([]byte, len(cipherText))
	mode := cipher.NewCBCDecrypter(block, ivBytes)
	mode.CryptBlocks(plainText, cipherText)

	// Remove padding
	unpaddedData, err := pkcs7Unpad(plainText, aes.BlockSize)
	if err != nil {
		return "", err
	}

	return string(unpaddedData), nil
}

// Omit removes specified keys from a map
func Omit(obj map[string]string, keys []string) map[string]string {
	result := make(map[string]string)
	for k, v := range obj {
		if !contains(keys, k) {
			result[k] = v
		}
	}
	return result
}

// parseKey converts a key to 32-byte length for AES-256
func parseKey(key string) ([]byte, error) {
	keyBytes := []byte(key)
	if len(keyBytes) > 32 {
		return nil, errors.New("key length must not exceed 32 bytes")
	}
	hexKey := hex.EncodeToString(keyBytes)
	paddedKey := strings.Repeat("0", 64-len(hexKey)) + hexKey
	return hex.DecodeString(paddedKey)
}

// pkcs7Pad applies PKCS#7 padding
func pkcs7Pad(data []byte, blockSize int) []byte {
	padding := blockSize - len(data)%blockSize
	padBytes := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padBytes...)
}

// pkcs7Unpad removes PKCS#7 padding
func pkcs7Unpad(data []byte, blockSize int) ([]byte, error) {
	if len(data) == 0 || len(data)%blockSize != 0 {
		return nil, errors.New("invalid padding size")
	}
	padding := int(data[len(data)-1])
	if padding > blockSize || padding == 0 {
		return nil, errors.New("invalid padding byte")
	}
	for _, p := range data[len(data)-padding:] {
		if int(p) != padding {
			return nil, errors.New("invalid padding content")
		}
	}
	return data[:len(data)-padding], nil
}

// contains checks if a slice contains a specific element
func contains(slice []string, item string) bool {
	for _, elem := range slice {
		if elem == item {
			return true
		}
	}
	return false
}

func encryptSimpleAES(data, key string) (string, error) {
	// This is a simple example of encryption (not recommended for production)
	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", err
	}

	ciphertext := make([]byte, aes.BlockSize+len(data))
	iv := ciphertext[:aes.BlockSize]

	_, err = io.ReadFull(rand.Reader, iv)
	if err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(data))

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}
