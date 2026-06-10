package handlers

import (
	"net/http"

	"github.com/abrarr21/watchLore/internal/config"
	"github.com/abrarr21/watchLore/internal/database"
	"github.com/abrarr21/watchLore/internal/storage"
)

type Handler struct {
	DB      *database.Database
	Cfg     *config.Config
	Storage storage.Storage
}

func New(db *database.Database, cfg *config.Config, s storage.Storage) *Handler {
	return &Handler{
		DB:      db,
		Cfg:     cfg,
		Storage: s,
	}
}

func (h *Handler) CheckHealth(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Server running perfectly ✅"))
}
