package handlers

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/abrarr21/watchLore/internal/models"
	"github.com/abrarr21/watchLore/internal/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func (h *Handler) CreateShows(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "invalid form data", nil)
		return
	}

	// parse plain fields
	var input models.ShowsRequest
	input.Title = r.FormValue("title")
	input.Type = models.ShowsType(r.FormValue("type"))
	input.Status = models.ShowsStatus(r.FormValue("status"))

	// parse genre (sent as multiple values: genre=Action&genre=Drama)
	input.Genre = r.Form["genre"]

	// parse optional rating
	if ratingStr := r.FormValue("rating"); ratingStr != "" {
		rating, err := strconv.ParseFloat(ratingStr, 64)
		if err != nil {
			utils.WriteJSON(w, http.StatusBadRequest, "invalid rating format", nil)
			return
		}
		input.Rating = &rating
	}

	// parse optional review
	if review := r.FormValue("review"); review != "" {
		input.Review = &review
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
		utils.WriteJSON(w, http.StatusBadRequest, "status must be one of: completed, watching, planned", nil)
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteJSON(w, http.StatusUnauthorized, "user not authenticated", nil)
		return
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "invalid user ID", nil)
		return
	}

	// Handle optianal image upload
	//Image is optional — r.FormFile("image") is only processed if present (err == nil), unlike CreateUser where it's required. Rollback only triggers if FileID is non-empty.
	var showImage models.ShowsImage
	file, header, err := r.FormFile("image")
	if err == nil {
		defer file.Close()
		uploaded, err := h.Storage.UploadImage(file, header.Filename)
		if err != nil {
			log.Printf("failed to upload image: %v", err)
			utils.WriteJSON(w, http.StatusInternalServerError, "failed to uplaod image", nil)
			return
		}
		showImage = *uploaded
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
		Images:    showImage,
		CreatedAt: now,
		UpdatedAt: now,
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	_, err = h.DB.Shows.InsertOne(ctx, show)
	if err != nil {
		//Rollback image upload if DB insert fails
		if showImage.FileID == "" {
			if deleteErr := h.Storage.DeleteImage(showImage.FileID); deleteErr != nil {
				log.Printf("rollback failed for fileID %s: %v", showImage.FileID, deleteErr)
			}
		}
		log.Printf("db insert failed: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to create show", nil)
		return
	}

	utils.WriteJSON(w, http.StatusCreated, "show created successfully", show)
}
