package flagvalues

import "fmt"

type AuthType string

const (
	AuthTypeDisabled AuthType = "disabled"
	AuthTypeOIDC     AuthType = "oidc"
	AuthTypeCocktail AuthType = "cocktail"
)

func (a *AuthType) Set(value string) error {
	switch value {
	case "disabled":
		*a = AuthTypeDisabled
	case "oidc":
		*a = AuthTypeOIDC
	case "cocktail":
		*a = AuthTypeCocktail
	case "":
	default:
		return fmt.Errorf("invalid auth type: %q. Must be one of [cocktail, oidc, disabled]", value)
	}
	return nil
}

func (a *AuthType) String() string {
	return string(*a)
}
