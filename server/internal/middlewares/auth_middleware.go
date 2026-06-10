package middlewares

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/abrarr21/watchLore/internal/utils"
)

type contextKey string

const (
	UserIDKey  contextKey = "UserIDKey"
	EmailIDKey contextKey = "EmailIDKey"
)

func RequireAuth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			tokenString := extractToken(r)

			if tokenString == "" {
				utils.WriteJSON(w, http.StatusUnauthorized, "missing token", nil)
				return
			}

			claims, err := utils.ParseToken(tokenString, jwtSecret)
			if err != nil {
				if errors.Is(err, utils.ErrTokenExpired) {
					utils.WriteJSON(w, http.StatusUnauthorized, "taken has expired", nil)
					return
				}

				utils.WriteJSON(w, http.StatusUnauthorized, "token is invalid", nil)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
			ctx = context.WithValue(ctx, EmailIDKey, claims.Email)

			next.ServeHTTP(w, r.WithContext(ctx))
		}

		return http.HandlerFunc(fn)
	}
}

func extractToken(r *http.Request) string {
	cookie, err := r.Cookie("accessToken")
	if err == nil {
		return cookie.Value
	}

	auth := r.Header.Get("Authorization")
	if token, found := strings.CutPrefix(auth, "Bearer "); found {
		return token
	}

	return ""
}

func GetUserID(r *http.Request) (string, bool) {
	v, ok := r.Context().Value(UserIDKey).(string)
	return v, ok
}

func GetEmailID(r *http.Request) (string, bool) {
	v, ok := r.Context().Value(EmailIDKey).(string)
	return v, ok
}
