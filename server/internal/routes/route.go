package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func RegisterAllRoutes(h *handlers.Handler) *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", h.CheckHealth)

	return r
}
