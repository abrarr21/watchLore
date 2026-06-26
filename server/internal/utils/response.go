package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, status int, message string, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(map[string]any{
		"success": status < 400,
		"message": message,
		"data":    data,
	})
}

func WriteError(w http.ResponseWriter, err error) {
	var status int
	var message string
	var data any

	var appErr *AppError
	var maxBytesErr *http.MaxBytesError

	// Extract AppError first so we can check its Base error in the switch below
	if errors.As(err, &appErr) {
		data = appErr.Data
		err = appErr.Base // Unwrap it to match the switch categories below
	}

	switch {
	case errors.As(err, &maxBytesErr):
		status = http.StatusRequestEntityTooLarge
		limitMB := float64(maxBytesErr.Limit) / (1024 * 1024)
		message = fmt.Sprintf("request payload too large: maximum allowed limit is %.1fMB", limitMB)
		slog.Warn("request rejected: payload exceeded limit", "limit_bytes", maxBytesErr.Limit)

	case errors.Is(err, ErrNotFound):
		status = http.StatusNotFound
		message = "resource not found"
		slog.Warn("resource not found", "err", err)

	case errors.Is(err, ErrUnauthorized):
		status = http.StatusUnauthorized
		message = "unauthorized"
		slog.Warn("user unauthorized", "err", err)

	case errors.Is(err, ErrForbidden):
		status = http.StatusForbidden
		message = "forbidden"
		slog.Warn("forbidden", "err", err)

	case errors.Is(err, ErrAlreadyExists):
		status = http.StatusConflict
		message = "already exists"
		slog.Warn("already exists", "err", err)

	case errors.Is(err, ErrInvalidInput):
		status = http.StatusBadRequest
		message = "invalid request"
		slog.Warn("invalid request", "err", err)

	case errors.Is(err, ErrBadGateway):
		status = http.StatusBadGateway
		message = "failed to fetch external content"
		slog.Warn("failed to fetch external content", "err", err)

	default:
		status = http.StatusInternalServerError
		message = "something went wrong"

		// Log the actual error details internally
		slog.Error("unexpected server error", "err", err)
	}

	// Use custom message if provided
	if appErr != nil && appErr.Msg != "" {
		message = appErr.Msg
	}

	// Send correct status, message, and custom data payload
	_ = WriteJSON(w, status, message, data)
}
