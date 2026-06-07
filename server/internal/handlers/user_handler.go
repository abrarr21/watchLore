package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/abrarr21/watchLore/internal/models"
	"github.com/abrarr21/watchLore/internal/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var input models.UserRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		log.Printf("failed to decode input body: %v", err)
		utils.WriteJSON(w, http.StatusBadRequest, "failed to parse request body", nil)
		return
	}

	if err := utils.Validate(input); err != nil {
		log.Printf("failed to validate request inputs: %v", err)
		utils.WriteJSON(w, http.StatusBadRequest, "request validation failed", err)
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("failed to hash the password: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "internal server error", nil)
		return
	}

	now := time.Now().UTC()

	user := models.User{
		ID:        bson.NewObjectID(),
		Name:      strings.TrimSpace(input.Name),
		Username:  strings.TrimSpace(input.Username),
		Email:     strings.ToLower(input.Email),
		Password:  string(hashed),
		CreatedAt: now,
		UpdatedAt: now,
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	result, err := h.DB.Users.InsertOne(ctx, user)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			utils.WriteJSON(w, http.StatusConflict, "The provided email address or username is already registered.", nil)
			return
		}
		log.Printf("failed to insert user: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to create user", nil)
		return
	}

	log.Println("User created: ", result.InsertedID)

	accessToken, err := utils.GenerateToken(user.ID.Hex(), user.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.AccessTokenTTL)
	if err != nil {
		log.Printf("failed to generate token: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to create user session", nil)
		return
	}

	refreshToken, err := utils.GenerateToken(user.ID.Hex(), user.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.RefreshTokenTTL)
	if err != nil {
		log.Printf("failed to generate token: %v", err)
		utils.WriteJSON(w, http.StatusInternalServerError, "failed to create user session", nil)
		return
	}

	utils.SetCookie(w, "accessToken", accessToken, 15*60)
	utils.SetCookie(w, "refreshToken", refreshToken, 7*24*60*60)

	response := models.UserResponse{
		ID:       user.ID.Hex(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
	}

	if err := utils.WriteJSON(w, http.StatusCreated, "user created successfully", response); err != nil {
		log.Printf("failed to encode register user response: %v", err)
	}

}
