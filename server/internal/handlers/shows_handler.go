package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"strconv"
	"time"

	"github.com/abrarr21/watchLore/internal/middlewares"
	"github.com/abrarr21/watchLore/internal/models"
	"github.com/abrarr21/watchLore/internal/utils"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func (h *Handler) CreateShows(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		// Client's fault: Sent invalid form payload
		utils.WriteError(w, fmt.Errorf("%w: invalid form data: %w", utils.ErrInvalidInput, err))
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
			utils.WriteError(w, fmt.Errorf("%w: invalid rating format", utils.ErrInvalidInput))
			return
		}
		input.Rating = &rating
	}

	// parse optional review
	if review := r.FormValue("review"); review != "" {
		input.Review = &review
	}

	if err := utils.Validate(input); err != nil {
		utils.WriteError(w, &utils.AppError{
			Base: utils.ErrInvalidInput,
			Msg:  "request validation failed",
			Data: err,
		})
		return
	}

	if !input.Type.IsValid() {
		utils.WriteError(w, fmt.Errorf("%w: type must be one of: anime, movie, series", utils.ErrInvalidInput))
		return
	}

	if !input.Status.IsValid() {
		utils.WriteError(w, fmt.Errorf("%w: status must be one of: completed, watching, planned", utils.ErrInvalidInput))
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteError(w, fmt.Errorf("%w: user not authenticated", utils.ErrUnauthorized))
		return
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid user ID", utils.ErrInvalidInput))
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
			utils.WriteError(w, fmt.Errorf("ImageKit upload failure: %w", err))
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
		if showImage.FileID != "" {
			if deleteErr := h.Storage.DeleteImage(showImage.FileID); deleteErr != nil {
				log.Printf("rollback failed for fileID %s: %v", showImage.FileID, deleteErr)
			}
		}
		utils.WriteError(w, fmt.Errorf("failed to save show in DB: %w", err))
		return
	}

	utils.WriteJSON(w, http.StatusCreated, "show created successfully", show)
}

func (h *Handler) GetAllShows(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := h.DB.Shows.Find(ctx, bson.D{}, opts)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("database query failed to fetch show: %w", err))
		return
	}
	defer cursor.Close(ctx)

	var shows []models.Shows

	if err := cursor.All(ctx, &shows); err != nil {
		utils.WriteError(w, fmt.Errorf("failed to decode show record from database cursor: %w", err))
		return
	}

	response := make([]models.ShowsResponse, 0)

	for _, show := range shows {
		response = append(response, models.ShowsResponse{
			ID:        show.ID.Hex(),
			Title:     show.Title,
			Type:      show.Type,
			Status:    show.Status,
			Genre:     show.Genre,
			Rating:    show.Rating,
			Review:    show.Review,
			Images:    show.Images,
			CreatedAt: show.CreatedAt,
			UpdatedAt: show.UpdatedAt,
		})
	}

	if err := utils.WriteJSON(w, http.StatusOK, "shows fetched successfully", response); err != nil {
		log.Printf("failed to encode GetAllShows response: %v", err)
	}
}

func (h *Handler) DeleteShow(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	showId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid show ID format", utils.ErrInvalidInput))
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteError(w, fmt.Errorf("%w: user not authenticated", utils.ErrUnauthorized))
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid user ID", utils.ErrInvalidInput))
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// fetch the show with ownership check
	var show models.Shows
	filter := bson.M{"_id": showId, "user_id": userObjID}
	err = h.DB.Shows.FindOne(ctx, filter).Decode(&show)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: show not found", utils.ErrNotFound))
		return
	}

	// delete with ownership check
	res, err := h.DB.Shows.DeleteOne(ctx, filter)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to delete show document: %w", err))
		return
	}

	if res.DeletedCount == 0 {
		utils.WriteJSON(w, http.StatusNotFound, "show not found", nil)
		return
	}

	// delete image from imageKit
	if show.Images.FileID != "" {
		if err := h.Storage.DeleteImage(show.Images.FileID); err != nil {
			slog.Error("failed to delete image from ImageKit", "imgFile", show.Images.FileID, "err", err)
		}
	}

	if err := utils.WriteJSON(w, http.StatusOK, "show deleted successfully", nil); err != nil {
		log.Printf("error encoding delete response: %v", err)
	}
}

func (h *Handler) GetById(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	showId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid show ID format", utils.ErrInvalidInput))
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var show models.Shows
	err = h.DB.Shows.FindOne(ctx, bson.M{"_id": showId}).Decode(&show)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			utils.WriteError(w, fmt.Errorf("%w: show not found", utils.ErrNotFound))
			return
		}

		utils.WriteError(w, fmt.Errorf("failed to retrieve show: %w", err))
		return
	}

	response := models.ShowsResponse{
		ID:        show.ID.Hex(),
		Title:     show.Title,
		Type:      show.Type,
		Status:    show.Status,
		Genre:     show.Genre,
		Rating:    show.Rating,
		Review:    show.Review,
		Images:    show.Images,
		CreatedAt: show.CreatedAt,
		UpdatedAt: show.UpdatedAt,
	}

	if err := utils.WriteJSON(w, http.StatusOK, "show fetched successfully", response); err != nil {
		log.Printf("error encoding GetById response")
	}
}

func (h *Handler) UpdateShow(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	id := chi.URLParam(r, "id")
	showId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid show ID format", utils.ErrInvalidInput))
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteError(w, fmt.Errorf("%w: user not authenticated", utils.ErrUnauthorized))
		return
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid user ID", utils.ErrInvalidInput))
		return
	}

	var input models.UpdateShowsRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		utils.WriteError(w, fmt.Errorf("%w: failed to parse request body: %v", utils.ErrInvalidInput, err))
		return
	}

	if err := utils.Validate(input); err != nil {
		utils.WriteError(w, &utils.AppError{
			Base: utils.ErrInvalidInput,
			Msg:  "validation failed",
			Data: err,
		})
		return
	}

	// Build dynamic Mongodb $set document based on non-nil fields
	updateDoc := bson.M{}

	if input.Status != nil {
		if !input.Status.IsValid() {
			utils.WriteError(w, fmt.Errorf("%w: status must be one of: completed, watching, planned", utils.ErrInvalidInput))
			return
		}
		updateDoc["status"] = *input.Status
	}

	if input.Rating != nil {
		updateDoc["rating"] = *input.Rating
	}

	if input.Review != nil {
		updateDoc["review"] = *input.Review
	}

	if input.Genre != nil {
		updateDoc["genre"] = input.Genre
	}

	if len(updateDoc) == 0 {
		utils.WriteError(w, fmt.Errorf("%w: no valid fields provided for update", utils.ErrInvalidInput))
		return
	}

	updateDoc["updated_at"] = time.Now().UTC()

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// Ensure the user updating the show is the owner
	filter := bson.M{"_id": showId, "user_id": userObjID}
	update := bson.M{"$set": updateDoc}

	res, err := h.DB.Shows.UpdateOne(ctx, filter, update)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to update show document: %w", err))
		return
	}

	if res.MatchedCount == 0 {
		// Show either doens't exist or doesn't belong to the logged-in user
		utils.WriteError(w, fmt.Errorf("%w: show not found or you do not have permission to edit it", utils.ErrNotFound))
		return
	}

	utils.WriteJSON(w, http.StatusOK, "show updated successfully", nil)
}

func (h *Handler) UploadShowImage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	showId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid show ID format", utils.ErrInvalidInput))
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteError(w, fmt.Errorf("%w: user not authenticated", utils.ErrUnauthorized))
		return
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid user ID", utils.ErrInvalidInput))
		return
	}

	// Ensure 10MB request limit
	r.Body = http.MaxBytesReader(w, r.Body, 10*1024*1024)

	// parse the multipart form
	err = r.ParseMultipartForm(10 << 20) // 10 MB in memroy buffer
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: file size exceeds 10MB limit or invalid form parameters", utils.ErrInvalidInput))
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: missing image file in request form", utils.ErrInvalidInput))
		return
	}
	defer file.Close()

	ctx, cancel := context.WithTimeout(r.Context(), 15*time.Second)
	defer cancel()

	// Verify show exists and belongs to the authenticated user
	var show models.Shows
	filter := bson.M{"_id": showId, "user_id": userObjID}
	err = h.DB.Shows.FindOne(ctx, filter).Decode(&show)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			utils.WriteError(w, fmt.Errorf("%w: show not found or unauthorized", utils.ErrNotFound))
			return
		}
		utils.WriteError(w, fmt.Errorf("database query failure: %w", err))
		return
	}

	// Upload the new image
	uploadImage, err := h.Storage.UploadImage(file, header.Filename)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: image file upload error: %v", utils.ErrInvalidInput, err))
		return
	}

	// update the show document in MongoDB
	update := bson.M{
		"$set": bson.M{
			"images":     *uploadImage,
			"updated_at": time.Now().UTC(),
		},
	}

	_, err = h.DB.Shows.UpdateOne(ctx, filter, update)
	if err != nil {
		// Rollback newly uploaded image from imagekit if DB update fails
		if delErr := h.Storage.DeleteImage(uploadImage.FileID); delErr != nil {
			// 1. Log the critical rollback failure internally
			slog.Error("image upload rollback failed (orphaned file left in storage)",
				"fileID", uploadImage.FileID,
				"err", delErr,
			)
			// 2. Log the database error and return a safe HTTP 500 to the client
			utils.WriteError(w, fmt.Errorf("failed to update show image in DB: %w", err))
			return
		}

	}

	// delete the old image if existed
	if show.Images.FileID != "" {
		go func(oldFileID string) {
			// run in background to not block client response
			if delErr := h.Storage.DeleteImage(oldFileID); delErr != nil {
				slog.Error("failed to delete old image from storage during update",
					"oldFileID", oldFileID,
					"err", delErr,
				)
			}
		}(show.Images.FileID)
	}

	utils.WriteJSON(w, http.StatusOK, "image uploaded successfully", uploadImage)
}

func (h *Handler) SaveExternalImageURL(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	id := chi.URLParam(r, "id")
	showId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid show ID format", utils.ErrInvalidInput))
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

	var input models.ExternalImageURLRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "failed to parse request body", nil)
		return
	}

	if err := utils.Validate(input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "validation failed", err)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// fetch the show to check the ownership and get any old image info
	var show models.Shows
	filter := bson.M{"_id": showId, "user_id": userObjID}
	err = h.DB.Shows.FindOne(ctx, filter).Decode(&show)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			utils.WriteJSON(w, http.StatusNotFound, "show not found or unauthenticated", nil)
			return
		}

		utils.WriteJSON(w, http.StatusInternalServerError, "failed to query show", nil)
		return
	}

	// prepare the external image struct (using placeholder metadata to satisfy validation tags)
	newImage := models.ShowsImage{
		URL:    input.URL,
		Name:   "external",
		FileID: "external",
	}

	// update the show in mongoDb
	update := bson.M{
		"$set": bson.M{
			"images":     newImage,
			"updated_at": time.Now().UTC(),
		},
	}

	_, err = h.DB.Shows.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("failed to save external image URL in DB: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to save image URL", nil)
		return
	}

	// Clean up old imageKit image if it was hosted on Imagekit
	if show.Images.FileID != "" && show.Images.FileID != "external" {
		go func(oldFileID string) {
			if delErr := h.Storage.DeleteImage(oldFileID); delErr != nil {
				log.Printf("failed to delete old image %s from Imagekit: %v", oldFileID, delErr)
			}
		}(show.Images.FileID)
	}

	utils.WriteJSON(w, http.StatusOK, "external image URL saved successfully", newImage)

}
