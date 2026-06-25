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
	Backdrop  *ShowsImage `json:"backdrop_image,omitempty"`
	Overview  *string     `json:"overview,omitempty"`
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

// TMDB structure
type TMDBItem struct {
	ID           int     `json:"id"`
	Title        string  `json:"title,omitempty"` // User for movies
	Name         string  `json:"name,omitempty"`  // used for tv/movies
	MediaType    string  `json:"media_type"`
	GenreIDs     []int   `json:"genre_ids"`
	VoteAverage  float64 `json:"vote_average"`
	PosterPath   string  `json:"poster_path"`
	BackdropPath string  `jon:"backdrop_path"`
	Overview     string  `json:"overview"`
}

type TMDBResponse struct {
	Results []TMDBItem `json:"results"`
}

var TmdbGenreMap = map[int]string{
	28:    "Action",
	12:    "Adventure",
	16:    "Animation",
	35:    "Comedy",
	80:    "Crime",
	99:    "Documentary",
	18:    "Drama",
	10751: "Family",
	14:    "Fantasy",
	27:    "Horror",
	9648:  "Mystery",
	10749: "Romance",
	878:   "Sci-Fi",
	53:    "Thriller",
	10759: "Action & Adventure", // TV Genre
	10765: "Sci-Fi & Fantasy",   // TV Genre
}
