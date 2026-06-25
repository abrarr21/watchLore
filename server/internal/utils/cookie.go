package utils

import (
	"net/http"
	"time"
)

func SetCookie(w http.ResponseWriter, name, value string, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		HttpOnly: true,
		Path:     "/",
		MaxAge:   maxAge,
		Expires:  time.Now().Add(time.Duration(maxAge) * time.Second),
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})
}

func ClearCookie(w http.ResponseWriter, name string) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		HttpOnly: true,
		Path:     "/",
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})
}
