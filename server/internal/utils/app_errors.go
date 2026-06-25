package utils

import "errors"

var (
	ErrNotFound      = errors.New("resource not found")
	ErrUnauthorized  = errors.New("unauthorized")
	ErrForbidden     = errors.New("forbidden")
	ErrAlreadyExists = errors.New("already exists")
	ErrInvalidInput  = errors.New("invalid input")
	ErrBadGateway    = errors.New("failed to fetch external content")
)

type AppError struct {
	Base error  // Category (e.g., ErrInvalidInput)
	Msg  string // Optional custom message for client
	Data any    // Custom payload (e.g., validation map)
}

func (e *AppError) Error() string {
	return e.Msg
}
