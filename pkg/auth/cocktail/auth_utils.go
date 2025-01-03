package cocktail

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"strings"
)

func toJSON(data interface{}) string {
	bytes, _ := json.Marshal(data)
	return string(bytes)
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
