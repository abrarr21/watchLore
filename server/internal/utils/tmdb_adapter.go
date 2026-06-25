package utils

import (
	"fmt"

	"github.com/abrarr21/watchLore/internal/models"
)

func MapTMDBToShowResponse(item models.TMDBItem) models.ShowsResponse {
	// TMDB uses 'title' for movies, 'name' for TV shows
	title := item.Title
	if title == "" {
		title = item.Name
	}

	// Translate TMDB media_type to your showsType enum
	showType := models.TypeMovie
	if item.MediaType == "tv" {
		showType = models.TypeSeries
	}

	// Map genre IDs to text string
	genres := make([]string, 0)
	for _, gid := range item.GenreIDs {
		if text, exists := models.TmdbGenreMap[gid]; exists {
			genres = append(genres, text)
		}
	}

	// Generate full poster URL using TMDB's CDN
	posterURL := ""
	if item.PosterPath != "" {
		posterURL = "https://image.tmdb.org/t/p/w500" + item.PosterPath
	}

	backdropURL := ""
	if item.BackdropPath != "" {
		backdropURL = "https://image.tmdb.org/t/p/w1280" + item.BackdropPath
	}

	return models.ShowsResponse{
		ID:       fmt.Sprintf("tmdb_%d", item.ID),
		Title:    title,
		Type:     showType,
		Genre:    genres,
		Overview: &item.Overview,
		Status:   models.StatusPlanned, // Defualt
		Rating:   &item.VoteAverage,
		Images: models.ShowsImage{
			URL:    posterURL,
			Name:   "tmdb_poster",
			FileID: "external",
		},
		BackdropImage: &models.ShowsImage{
			URL:    backdropURL,
			Name:   "tmdb_backdrop",
			FileID: "external_backdrop",
		},
	}
}
