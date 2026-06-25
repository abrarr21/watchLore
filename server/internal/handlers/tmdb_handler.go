package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/abrarr21/watchLore/internal/models"
	"github.com/abrarr21/watchLore/internal/utils"
	"github.com/go-chi/chi/v5"
)

var contentEndpoints = map[string]string{
	"trending": "/trending/all/week",
	"movies":   "/discover/movie",
	"series":   "/discover/tv?without_genres=16",
	"anime":    "/discover/tv?with_genres=16&with_origin_country=JP",
}

// Low-level client requester
func (h *Handler) fetchTMDB(ctx context.Context, endpoint string, clientQuery url.Values) (*models.TMDBResponse, error) {
	tmdbURL, err := url.Parse("https://api.themoviedb.org/3" + endpoint)
	if err != nil {
		return nil, err
	}

	// Merge query parameters (e.g. forward pagination "?page=2")
	q := tmdbURL.Query()
	for key, values := range clientQuery {
		if len(values) > 0 {
			q.Set(key, values[0])
		}
	}
	tmdbURL.RawQuery = q.Encode()

	req, err := http.NewRequestWithContext(ctx, "GET", tmdbURL.String(), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+h.Cfg.TMDB.TMDB_KEY)
	req.Header.Set("accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("tmdb returned status code %d", resp.StatusCode)
	}

	var data models.TMDBResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return &data, nil
}

// Generic controller logic
func (h *Handler) discoverShows(w http.ResponseWriter, r *http.Request, endpoint string, successMsg string) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	data, err := h.fetchTMDB(ctx, endpoint, r.URL.Query())
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: TMDB discover content fetch failure: %v", utils.ErrBadGateway, err))
		return
	}

	shows := make([]models.ShowsResponse, 0, len(data.Results))
	for _, item := range data.Results {
		shows = append(shows, utils.MapTMDBToShowResponse(item))
	}

	utils.WriteJSON(w, http.StatusOK, successMsg, shows)
}

// Unified route handler
func (h *Handler) GetContentByType(w http.ResponseWriter, r *http.Request) {
	contentType := chi.URLParam(r, "type")

	endpoint, ok := contentEndpoints[contentType]
	if !ok {
		utils.WriteError(w, fmt.Errorf("%w: unknown discover content type: %s", utils.ErrNotFound, contentType))
		return
	}

	h.discoverShows(w, r, endpoint, fmt.Sprintf("%s content fetched successfully", contentType))
}
