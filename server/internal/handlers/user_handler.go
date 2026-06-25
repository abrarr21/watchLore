package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/abrarr21/watchLore/internal/middlewares"
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
		utils.WriteError(w, fmt.Errorf("%w, failed to parse request body: %v", utils.ErrInvalidInput, err))
		return
	}

	if valErrors := utils.Validate(input); valErrors != nil {
		utils.WriteError(w, &utils.AppError{
			Base: utils.ErrInvalidInput,
			Msg:  "request validation failed",
			Data: valErrors,
		})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to hash the password: %w", err))
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
			utils.WriteError(w, &utils.AppError{
				Base: utils.ErrAlreadyExists,
				Msg:  "The provided email address or username is already registered",
			})
			return
		}
		utils.WriteError(w, fmt.Errorf("failed to insert user: %w", err))
		return
	}

	log.Println("User created: ", result.InsertedID)

	accessToken, err := utils.GenerateToken(user.ID.Hex(), user.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.AccessTokenTTL)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to generate access token: %w", err))
		return
	}

	refreshToken, err := utils.GenerateToken(user.ID.Hex(), user.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.RefreshTokenTTL)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to generate refresh token: %w", err))
		return
	}

	utils.SetCookie(w, "accessToken", accessToken, int(h.Cfg.JWT.AccessTokenTTL.Seconds()))
	utils.SetCookie(w, "refreshToken", refreshToken, int(h.Cfg.JWT.RefreshTokenTTL.Seconds()))

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

func (h *Handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var input models.LoginUserRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		utils.WriteError(w, fmt.Errorf("%w, failed to parse request body: %v", utils.ErrInvalidInput, err))
		return
	}

	if err := utils.Validate(input); err != nil {
		utils.WriteError(w, &utils.AppError{
			Base: utils.ErrInvalidInput,
			Msg:  "request validation failed",
			Data: err,
		})
		return
	}

	input.Email = strings.ToLower(input.Email)

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var user models.User

	err := h.DB.Users.FindOne(ctx, bson.D{{Key: "email", Value: input.Email}}).Decode(&user)
	if err != nil {
		// 1. Client's fault: Email was not found in DB
		utils.WriteError(w, fmt.Errorf("%w: invalid credentials", utils.ErrUnauthorized))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid credentials", utils.ErrUnauthorized))
		return
	}

	accessToken, err := utils.GenerateToken(user.ID.Hex(), user.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.AccessTokenTTL)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to generate access token: %w", err))
		return
	}

	refreshToken, err := utils.GenerateToken(user.ID.Hex(), user.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.RefreshTokenTTL)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("failed to generate refresh token: %w", err))
		return
	}

	utils.SetCookie(w, "accessToken", accessToken, int(h.Cfg.JWT.AccessTokenTTL.Seconds()))
	utils.SetCookie(w, "refreshToken", refreshToken, int(h.Cfg.JWT.RefreshTokenTTL.Seconds()))

	response := models.UserResponse{
		ID:       user.ID.Hex(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
	}

	if err := utils.WriteJSON(w, http.StatusOK, "Log in successfully", response); err != nil {
		log.Printf("failed to encode login handlers response: %v", err)
	}
}

func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refreshToken")
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: missing refresh token", utils.ErrUnauthorized))
		return
	}

	claims, err := utils.ParseToken(cookie.Value, h.Cfg.JWT.JWT_SECRET)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("%w: invalid or expired refresh token", utils.ErrUnauthorized))
		return
	}

	accessToken, err := utils.GenerateToken(claims.UserID, claims.Email, h.Cfg.JWT.JWT_SECRET, h.Cfg.JWT.AccessTokenTTL)
	if err != nil {
		utils.WriteError(w, fmt.Errorf("refresh token: failed to generate access token: %w", err))
		return
	}

	utils.SetCookie(w, "accessToken", accessToken, int(h.Cfg.JWT.AccessTokenTTL.Seconds()))
	if err := utils.WriteJSON(w, http.StatusOK, "token refreshed", nil); err != nil {
		log.Printf("failed to encode response: %v", err)
	}
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	utils.ClearCookie(w, "accessToken")
	utils.ClearCookie(w, "refreshToken")

	if err := utils.WriteJSON(w, http.StatusOK, "logged out successfully", nil); err != nil {
		log.Printf("failed to encode response: %v", err)
	}
}

func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	emailID, ok := middlewares.GetEmailID(r)
	if !ok {
		utils.WriteError(w, fmt.Errorf("%w, unauthorized user", utils.ErrUnauthorized))
		return
	}
	emailID = strings.ToLower(emailID)
	log.Println(emailID)

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var user models.User
	err := h.DB.Users.FindOne(ctx, bson.D{{Key: "email", Value: emailID}}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			utils.WriteError(w, fmt.Errorf("%w: invalid credentials", utils.ErrUnauthorized))
			return
		}
		utils.WriteError(w, fmt.Errorf("GetMe: failed to fetch user: %w", err))
		return
	}

	response := models.UserResponse{
		ID:       user.ID.Hex(),
		Name:     user.Name,
		Username: user.Username,
		Email:    user.Email,
	}

	if err := utils.WriteJSON(w, http.StatusOK, "User fetched successfully", response); err != nil {
		log.Printf("GetMe: failed to encode response: %v", err)
	}
}
