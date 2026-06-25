package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/go-chi/chi/v5"
)

func ShowsRoutes(r chi.Router, h *handlers.Handler) {

	r.Route("/api/shows", func(r chi.Router) {

		// Req limit: 200 KB
		r.Group(func(r chi.Router) {
			r.Use(middlewares.LimitBodySize(200 * 1024))

			r.Get("/", h.GetAllShows)
			r.Get("/{id}", h.GetById)

			// protected routes
			r.Group(func(r chi.Router) {
				r.Use(middlewares.RequireAuth(h.Cfg.JWT.JWT_SECRET))

				r.Delete("/{id}", h.DeleteShow)
				r.Patch("/{id}", h.UpdateShow)
				r.Post("/{id}/images/url", h.SaveExternalImageURL)
			})
		})

		// protected routes
		r.Group(func(r chi.Router) {
			r.Use(middlewares.LimitBodySize(10 * 1024 * 1024)) // 10 MB
			r.Use(middlewares.RequireAuth(h.Cfg.JWT.JWT_SECRET))

			r.Post("/", h.CreateShows)

			r.Post("/{id}/images/upload", h.UploadShowImage)
		})
	})
}
