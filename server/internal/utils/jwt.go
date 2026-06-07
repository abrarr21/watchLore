package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrTokenExpired = errors.New("Token has expired")
	ErrTokenInvalid = errors.New("Token is invalid")
)

type Claims struct {
	UserID string `json:"userID"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func GenerateToken(useridProvided, email, jwtSecret string, ttl time.Duration) (string, error) {
	claims := Claims{
		UserID: useridProvided,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   email,
		},
	}

	// Create a JWT signed with the HS256 algorithm using the provided claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the application's secret key and return the JWT string.
	return token.SignedString([]byte(jwtSecret))
}
