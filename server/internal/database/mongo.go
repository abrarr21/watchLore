package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/abrarr21/watchLore/internal/config"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type Database struct {
	client *mongo.Client
	DB     *mongo.Database
	Users  *mongo.Collection
}

func ConnectDB(cfg *config.DatabaseConfig) (*Database, error) {
	opt := options.Client().ApplyURI(cfg.MongoDB_URI).SetServerSelectionTimeout(10 * time.Second).SetMaxConnIdleTime(1 * time.Minute)

	c, err := mongo.Connect(opt)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := c.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("failed to Ping MongoDB: %w", err)
	}

	log.Println("MongoDB connected ✅")

	db := c.Database(cfg.DBName)
	users := db.Collection("users")

	return &Database{
		client: c,
		DB:     db,
		Users:  users,
	}, nil
}

func (d *Database) Disconnect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := d.client.Disconnect(ctx); err != nil {
		return fmt.Errorf("failed to disconnect from MongoDB: %w", err)
	}

	log.Println("Disconnected from MongoDB")

	return nil
}
