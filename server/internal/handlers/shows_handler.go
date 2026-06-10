package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/abrarr21/watchLore/internal/models"
	"github.com/abrarr21/watchLore/internal/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func (h *Handler) CreateShows(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var input models.Shows

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		log.Printf("failed to decode input body: %v", err)
		utils.WriteJSON(w, http.StatusBadRequest, "failed to parse request body", nil)
		return
	}

	if err := utils.Validate(input); err != nil {
		log.Printf("failed to validate request inputs: %v", err)
		utils.WriteJSON(w, http.StatusBadRequest, "request validation failed", err)
		return
	}

	if !input.Type.IsValid() {
		utils.WriteJSON(w, http.StatusBadRequest, "type must be one of: anime, movie, series", nil)
		return
	}

	if !input.Status.IsValid() {
		utils.WriteJSON(w, http.StatusBadRequest, "status must be one of:watching, completed, planned", nil)
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteJSON(w, http.StatusUnauthorized, "user not authenticated", nil)
		return
	}
	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "invalid user ID format", nil)
		return
	}

	now := time.Now().UTC()

	show := models.Shows{
		ID:        bson.NewObjectID(),
		UserID:    userObjID,
		Title:     input.Title,
		Type:      input.Type,
		Genre:     input.Genre,
		Status:    input.Status,
		Rating:    input.Rating,
		Review:    input.Review,
		CreatedAt: now,
		UpdatedAt: now,
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	res, err := h.DB.Shows.InsertOne(ctx, show)
	if err != nil {
		log.Printf("failed to insert show: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to create show", nil)
		return
	}

	log.Println("show created:", res.InsertedID)

	response := models.ShowsResponse{
		ID:        show.ID.Hex(),
		Title:     show.Title,
		Type:      show.Type,
		Genre:     show.Genre,
		Status:    show.Status,
		Rating:    *show.Rating,
		Review:    *show.Review,
		CreatedAt: show.CreatedAt,
		UpdatedAt: show.UpdatedAt,
	}

	if err := utils.WriteJSON(w, http.StatusCreated, "show created successfully", response); err != nil {
		log.Printf("failed to encode create show response: %v", err)
	}
}
