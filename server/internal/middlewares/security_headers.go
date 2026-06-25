package middlewares

import "net/http"

func LimitBodySize(limitByte int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			r.Body = http.MaxBytesReader(w, r.Body, limitByte)
			next.ServeHTTP(w, r)
		})
	}
}
