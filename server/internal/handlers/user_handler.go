package handlers

import "net/http"

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("create user route hit"))
}
