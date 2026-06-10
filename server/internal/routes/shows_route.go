package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/go-chi/chi/v5"
)

func ShowsRoutes(r chi.Router, h *handlers.Handler) {
	r.Group(func(r chi.Router) {

		r.Use(middlewares.RequireAuth(h.Cfg.JWT.JWT_SECRET))
		r.Route("/api/shows", func(r chi.Router) {
			r.Post("/", h.CreateShows)
		})
	})
}
