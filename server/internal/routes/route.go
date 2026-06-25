package routes

import (
	"time"

	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/httprate"
)

func RegisterAllRoutes(h *handlers.Handler) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Compress(5)) // compress response payload
	r.Use(httprate.LimitByIP(100, 1*time.Minute))
	r.Use(middleware.Recoverer) // Handles any panic and returns a 500 error
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

	// Route group that have a limit of req body of 200 KB
	r.Group(func(r chi.Router) {
		r.Use(middlewares.LimitBodySize(200 * 1024)) // 200 KB req body cap

		UserRoutes(r, h)
		TMDBRoutes(r, h)
	})

	ShowsRoutes(r, h)

	return r
}
