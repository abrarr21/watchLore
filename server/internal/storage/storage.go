package storage

import (
	"mime/multipart"

	"github.com/abrarr21/watchLore/internal/models"
)

type Storage interface {
	UploadImage(file multipart.File, filename string) (*models.ShowsImage, error)
	DeleteImage(fileID string) error
}
