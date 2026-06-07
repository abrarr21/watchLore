package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func UserRoutes(r chi.Router, h *handlers.Handler) {

	r.Route("/auth/users", func(r chi.Router) {
		r.Post("/register", h.RegisterUser)
		r.Post("/login", h.LoginUser)
		r.Post("/refresh", h.RefreshToken)
		r.Post("/logout", h.Logout)
	})
}
