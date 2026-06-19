package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func UserRoutes(r chi.Router, h *handlers.Handler) {

	// Global middleware — applies to all routes
	// r.Use(func(next http.Handler) http.Handler {
	// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		r.Body = http.MaxBytesReader(w, r.Body, 3*1024*1024) // 3MB
	// 		next.ServeHTTP(w, r)
	// 	})
	// })

	r.Route("/auth/users", func(r chi.Router) {
		r.Post("/register", h.RegisterUser)
		r.Post("/login", h.LoginUser)
		r.Post("/refresh", h.RefreshToken)
		r.Post("/logout", h.Logout)
	})
}
