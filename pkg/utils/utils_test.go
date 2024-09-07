package utils_test

import (
	"testing"
)

func TestConatins(t *testing.T) {
	t.Parallel()

	if !Contains([]string{"a", "b", "c"}, "b") {
		t.Error("Expected true")
	}

	if Contains([]int{1, 2, 3}, 4) {
		t.Error("Expected false")
	}
}
