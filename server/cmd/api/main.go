package main

import (
	"context"
	"log/slog"
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

var (
	Version   = "dev"
	Commit    = "unknown"
	BuildTime = "unknown"
)

func main() {
	// ── 1. Config ─────────────────────────────────────────────────────
	cfg := config.Load()

	// ── 2. Logger setup ───────────────────────────────────────────────
	var logHandler slog.Handler
	if cfg.Server.Env == "production" {
		logHandler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	} else {
		logHandler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug})
	}
	slog.SetDefault(slog.New(logHandler))

	slog.Info("starting watchLore",
		"version", Version,
		"commit", Commit,
		"built", BuildTime,
	)

	// ── 3. Database ───────────────────────────────────────────────────
	db, err := database.ConnectDB(&cfg.Database)
	if err != nil {
		slog.Error("database connection failed", "err", err)
		os.Exit(1)
	}

	defer func() {
		if err := db.Disconnect(); err != nil {
			slog.Warn("Warning: could not Disconnect from MongoDB cleanly", "err", err)
		}
	}()

	// Dependencies
	imageStorage := storage.NewImageKitStorage(&cfg.ImageKit)
	h := handlers.New(db, cfg, imageStorage)

	router := routes.RegisterAllRoutes(h)

	// Http server with timeout
	srv := &http.Server{
		Addr:    ":" + cfg.Server.Port,
		Handler: router,
		// Without these, a slow/malicious client can hold connections open forever.
		ReadHeaderTimeout: 5 * time.Second,  // prevents Slowloris
		ReadTimeout:       10 * time.Second, // full request body deadline
		WriteTimeout:      30 * time.Second, // full response write deadline
		IdleTimeout:       60 * time.Second, // keep-alive between requests
	}

	// Start server (non-blocking)
	serverErr := make(chan error, 1)
	go func() {
		slog.Info("server listening", "port", cfg.Server.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			serverErr <- err
		}
	}()

	// block until shutdown signal OR server error
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-serverErr:
		// server died b4 we asked it to - exit immediately
		slog.Error("server error", "err", err)
		os.Exit(1)

	case sig := <-quit:
		slog.Info("shutdown signal received", "signal", sig.String())
	}

	// graceful shutdown
	shutdonwCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	slog.Info("shutting down server", "timeout_seconds", 10)
	if err := srv.Shutdown(shutdonwCtx); err != nil {
		slog.Error("forced shutdown after timeout", "err", err)
		os.Exit(1)
	}

	slog.Info("Server closed gracefully")
}
