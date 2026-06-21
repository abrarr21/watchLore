package routes

import (
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/go-chi/chi/v5"
)

func ShowsRoutes(r chi.Router, h *handlers.Handler) {

	r.Route("/api/shows", func(r chi.Router) {

		// pubilc routes
		r.Get("/", h.GetAllShows)
		r.Get("/{id}", h.GetById)

		// protected routes
		r.Group(func(r chi.Router) {
			r.Use(middlewares.RequireAuth(h.Cfg.JWT.JWT_SECRET))

			r.Post("/", h.CreateShows)
			r.Delete("/{id}", h.DeleteShow)
			r.Patch("/{id}", h.UpdateShow)

			r.Post("/{id}/images/upload", h.UploadShowImage)
			r.Post("/{id}/images/url", h.SaveExternalImageURL)
		})
	})
}
