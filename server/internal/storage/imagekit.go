package storage

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/abrarr21/watchLore/internal/config"
	"github.com/abrarr21/watchLore/internal/models"
	imagekit "github.com/imagekit-developer/imagekit-go/v2"
	"github.com/imagekit-developer/imagekit-go/v2/option"
)

type ImageKitStorage struct {
	client imagekit.Client
}

func NewImageKitStorage(cfg *config.ImagekitConfig) *ImageKitStorage {
	return &ImageKitStorage{
		client: imagekit.NewClient(option.WithPrivateKey(cfg.ImgPvtKey)),
	}
}

func (s *ImageKitStorage) UploadImage(file multipart.File, filename string) (*models.ShowsImage, error) {

	buffer := make([]byte, 512)

	_, err := file.Read(buffer)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	contentType := http.DetectContentType(buffer)

	switch contentType {
	case "image/jpeg", "image/jpg", "image/png", "image/webp":
	default:
		return nil, fmt.Errorf("unsupported image format: %s", contentType)
	}

	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return nil, fmt.Errorf("failed to reset file pointer: %w", err)
	}

	imgExtension := strings.ToLower(filepath.Ext(filename))
	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !allowedExtensions[imgExtension] {
		return nil, fmt.Errorf("unsupported file extension: %s", imgExtension)
	}

	uniqueFilename := fmt.Sprintf("%d%s", time.Now().UnixNano(), imgExtension)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	resp, err := s.client.Files.Upload(ctx, imagekit.FileUploadParams{
		File:     file,
		FileName: uniqueFilename,
	})

	if err != nil {
		return nil, fmt.Errorf("imagekit upload failed: %w", err)
	}

	return &models.ShowsImage{
		URL:    resp.URL,
		Name:   resp.Name,
		FileID: resp.FileID,
	}, nil
}

func (s *ImageKitStorage) DeleteImage(fileID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := s.client.Files.Delete(ctx, fileID)
	if err != nil {
		return fmt.Errorf("imagekit delete failed: %w", err)
	}

	return nil
}
