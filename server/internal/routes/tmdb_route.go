package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/go-chi/chi/v5"
)

func TMDBRoutes(r chi.Router, h *handlers.Handler) {
	r.Route("/api/discover", func(r chi.Router) {
		r.Use(middlewares.RequireAuth(h.Cfg.JWT.JWT_SECRET))

		r.Get("/{type}", h.GetContentByType)
	})
}
