package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func RegisterAllRoutes(h *handlers.Handler) *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	// 2. Add Chi's CORS middleware configuration
	r.Use(cors.Handler(cors.Options{
		// Set to your frontend domain in production (e.g. []string{"https://watchlore.onrender.com"})
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value for preflight request cache (in seconds)
	}))

	r.Get("/", h.CheckHealth)

	UserRoutes(r, h)
	ShowsRoutes(r, h)
	TMDBRoutes(r, h)

	return r
}
