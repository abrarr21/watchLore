package routes

import (
	"net/http"
	"path/filepath"
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
		AllowedOrigins:   h.Cfg.Server.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value for preflight request cache (in seconds)
	}))

	r.Get("/api/health", h.CheckHealth)

	// Route group that have a limit of req body of 200 KB
	r.Group(func(r chi.Router) {
		r.Use(middlewares.LimitBodySize(200 * 1024)) // 200 KB req body cap

		UserRoutes(r, h)
		TMDBRoutes(r, h)
	})

	ShowsRoutes(r, h)

	staticDir := "../client/dist"
	serveSPA(r, staticDir)

	return r
}

func serveSPA(r chi.Router, staticDir string) {
	fs := http.Dir(staticDir)
	fileServer := http.FileServer(fs)

	r.Get("/*", func(w http.ResponseWriter, req *http.Request) {
		path := filepath.Clean(req.URL.Path)

		// Open the file to verify if it exists
		f, err := fs.Open(path)
		if err != nil {
			// File does not exist, serve index.html (SPA Fallback)
			http.ServeFile(w, req, filepath.Join(staticDir, "index.html"))
			return
		}
		f.Close()

		// File exists, serve it
		fileServer.ServeHTTP(w, req)
	})
}
