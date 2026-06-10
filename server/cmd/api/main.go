package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/abrarr21/watchLore/internal/config"
	"github.com/abrarr21/watchLore/internal/database"
	"github.com/abrarr21/watchLore/internal/handlers"
	"github.com/abrarr21/watchLore/internal/routes"
	"github.com/abrarr21/watchLore/internal/storage"
)

func main() {
	cfg := config.Load()
	db, err := database.ConnectDB(&cfg.Database)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	defer func() {
		if err := db.Disconnect(); err != nil {
			log.Printf("Warning: could not Disconnect from MongoDB cleanly: %v", err)
		}
	}()

	imageStorage := storage.NewImageKitStorage(&cfg.ImageKit)
	h := handlers.New(db, cfg, imageStorage)

	router := routes.RegisterAllRoutes(h)

	srv := &http.Server{
		Addr:    ":" + cfg.Server.Port,
		Handler: router,
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Println("Server listening at Port: ", cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil {
			log.Println("failed to start: ", err)
		}
	}()

	sig := <-quit
	log.Println("server Shutdown signal received: ", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("failed to close server gracefully, forcing Shutdown: %v", err)
	}

	log.Println("Server closed gracefully")
}
