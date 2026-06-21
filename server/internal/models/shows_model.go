package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type ShowsImage struct {
	URL    string `bson:"url" json:"url" validate:"required,url"`
	Name   string `bson:"name" json:"name" validate:"required,min=1,max=255"`
	FileID string `bson:"file_id" json:"file_id" validate:"required"`
}

// creating enums
type ShowsType string
type ShowsStatus string

const (
	TypeAnime  ShowsType = "anime"
	TypeMovie  ShowsType = "movie"
	TypeSeries ShowsType = "series"
)

const (
	StatusWatching  ShowsStatus = "watching"
	StatusCompleted ShowsStatus = "completed"
	StatusPlanned   ShowsStatus = "planned"
)

// Enum validation helpers
func (t ShowsType) IsValid() bool {
	switch t {
	case TypeAnime, TypeMovie, TypeSeries:
		return true
	default:
		return false
	}
}

func (s ShowsStatus) IsValid() bool {
	switch s {
	case StatusCompleted, StatusPlanned, StatusWatching:
		return true
	default:
		return false
	}
}

type Shows struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	UserID    bson.ObjectID `bson:"user_id"`
	Title     string        `bson:"title"`
	Type      ShowsType     `bson:"type"`
	Genre     []string      `bson:"genre"`
	Status    ShowsStatus   `bson:"status"`
	Rating    *float64      `bson:"rating,omitempty"`
	Review    *string       `bson:"review,omitempty"`
	Images    ShowsImage    `bson:"images,omitempty"`
	CreatedAt time.Time     `bson:"created_at"`
	UpdatedAt time.Time     `bson:"updated_at"`
}

type ShowsRequest struct {
	Title  string      `json:"title" validate:"required,min=1,max=200"`
	Type   ShowsType   `json:"type" validate:"required"`
	Genre  []string    `json:"genre" validate:"required,dive,min=1"`
	Status ShowsStatus `json:"status" validate:"required"`
	Rating *float64    `json:"rating,omitempty" validate:"omitempty,gte=0,lte=10"`
	Review *string     `json:"review,omitempty"`
	Images ShowsImage  `json:"images" validate:"omitempty"`
}

type ShowsResponse struct {
	ID        string      `json:"id"`
	Title     string      `json:"title"`
	Type      ShowsType   `json:"type"`
	Genre     []string    `json:"genre"`
	Status    ShowsStatus `json:"status"`
	Rating    *float64    `json:"rating,omitempty"`
	Review    *string     `json:"review,omitempty"`
	Images    ShowsImage  `json:"images"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
}

type UpdateShowsRequest struct {
	Status *ShowsStatus `json:"status" validate:"omitempty"`
	Rating *float64     `json:"rating,omitempty" validate:"omitempty,gte=0,lte=10"`
	Review *string      `json:"review,omitempty"`
	Genre  []string     `json:"genre" validate:"omitempty,dive,min=1"`
}

type ExternalImageURLRequest struct {
	URL string `json:"url" validate:"required,url"`
}
