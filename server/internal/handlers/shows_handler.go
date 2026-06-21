package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"log"
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
		if showImage.FileID != "" {
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

func (h *Handler) GetAllShows(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := h.DB.Shows.Find(ctx, bson.D{}, opts)
	if err != nil {
		log.Printf("failed to fetch shows: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to fetch notes", nil)
		return
	}
	defer cursor.Close(ctx)

	var shows []models.Shows

	if err := cursor.All(ctx, &shows); err != nil {
		log.Printf("failed to decode shows: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to decode shows", nil)
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
		utils.WriteJSON(w, http.StatusBadRequest, "invalid show id", nil)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	// fetch the show
	var show models.Shows
	err = h.DB.Shows.FindOne(ctx, bson.M{"_id": showId}).Decode(&show)
	if err != nil {
		utils.WriteJSON(w, http.StatusNotFound, "show not found", nil)
		return
	}

	// delete from MongoDB
	res, err := h.DB.Shows.DeleteOne(ctx, bson.M{"_id": showId})
	if err != nil {
		log.Printf("failed to delete show %s: %v", id, err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to delte show", nil)
		return
	}

	if res.DeletedCount == 0 {
		utils.WriteJSON(w, http.StatusNotFound, "show not found", nil)
		return
	}

	// delete image from imageKit
	if show.Images.FileID != "" {
		if err := h.Storage.DeleteImage(show.Images.FileID); err != nil {
			log.Printf("failed to delete image %s: %v", show.Images.FileID, err)
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
		utils.WriteJSON(w, http.StatusBadRequest, "invalid show id", nil)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var show models.Shows
	err = h.DB.Shows.FindOne(ctx, bson.M{"_id": showId}).Decode(&show)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			utils.WriteJSON(w, http.StatusNotFound, "show not found", nil)
			return
		}

		log.Printf("failed to fetch show: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to fetch show", nil)
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
		utils.WriteJSON(w, http.StatusBadRequest, "invalid show id", nil)
		return
	}

	userID, ok := middlewares.GetUserID(r)
	if !ok {
		utils.WriteJSON(w, http.StatusUnauthorized, "user not authenticated", nil)
		return
	}

	userObjID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "invalid user id", nil)
		return
	}

	var input models.UpdateShowsRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "failed to parse request body", nil)
		return
	}

	if err := utils.Validate(input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "validation failed", nil)
		return
	}

	// Build dynamic Mongodb $set document based on non-nil fields
	updateDoc := bson.M{}

	if input.Status != nil {
		if !input.Status.IsValid() {
			utils.WriteJSON(w, http.StatusBadRequest, "status must be one of: completed, watching, planned", nil)
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
		utils.WriteJSON(w, http.StatusBadRequest, "no valid fields provided for update", nil)
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
		log.Printf("failed to update show %s: %v", id, err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to update show", nil)
		return
	}

	if res.MatchedCount == 0 {
		// Show either doens't exist or doesn't belong to the logged-in user
		utils.WriteJSON(w, http.StatusNotFound, "show not found or StatusUnauthorized", nil)
		return
	}

	utils.WriteJSON(w, http.StatusOK, "show updated successfully", nil)
}

func (h *Handler) UploadShowImage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	showId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "invalid show id", nil)
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

	// Ensure 10MB request limit
	r.Body = http.MaxBytesReader(w, r.Body, 10*1024*1024)

	// parse the multipart form
	err = r.ParseMultipartForm(10 << 20) // 10 MB in memroy buffer
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "file size exceeds 10MB limit or invalid form", nil)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "missing image file in request form", nil)
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
			utils.WriteJSON(w, http.StatusNotFound, "show not found or unauthorized", nil)
			return
		}
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to query show", nil)
		return
	}

	// Upload the new image
	uploadImage, err := h.Storage.UploadImage(file, header.Filename)
	if err != nil {
		log.Printf("image upload faild: %v", err)
		utils.WriteJSON(w, http.StatusBadRequest, err.Error(), nil)
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
			log.Printf("rollback failed for fileID %s: %v", uploadImage.FileID, delErr)
			log.Printf("failed to update show image in DB: %v", err)
			utils.WriteJSON(w, http.StatusInternalServerError, "failed to save image metadata", nil)
			return
		}

	}

	// delete the old image if existed
	if show.Images.FileID != "" {
		go func(oldFileID string) {
			// run in background to not block client response
			if delErr := h.Storage.DeleteImage(oldFileID); delErr != nil {
				log.Printf("failed to delete old image %s: %v", oldFileID, delErr)
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
		utils.WriteJSON(w, http.StatusBadRequest, "invalid show id", nil)
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

func (h *Handler) GetTrendingShows(w http.ResponseWriter, r *http.Request) {
	tmdbToken := h.Cfg.TMDB.TMDB_KEY
	if tmdbToken == "" {
		utils.WriteJSON(w, http.StatusInternalServerError, "trending service unconfigured", nil)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	// 1. Create external HTTP request
	req, err := http.NewRequestWithContext(ctx, "GET", "https://api.themoviedb.org/3/trending/all/day?language=en-US", nil)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to build request", nil)
		return
	}

	req.Header.Set("Authorization", "Bearer "+tmdbToken)
	req.Header.Set("accept", "appication/json")

	// 2. Perform the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, "failed to reach TMDB API", nil)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		utils.WriteJSON(w, http.StatusBadGateway, "TMDB API returned error status", nil)
		return
	}

	// 3. Decode TMDB response
	var tmdbData models.TMDBResponse
	if err := json.NewDecoder(resp.Body).Decode(&tmdbData); err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to decode TMDB response", nil)
		return
	}

	// 4. Map TMDB results to your ShowsResponse structure
	normalizedShows := make([]models.ShowsResponse, 0, len(tmdbData.Results))

	for _, item := range tmdbData.Results {
		normalizedShows = append(normalizedShows, utils.MapTMDBToShowResponse(item))
	}

	utils.WriteJSON(w, http.StatusOK, "trending shows fetched successfully", normalizedShows)
}
