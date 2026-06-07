package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type ServerConfig struct {
	Port string
	Env  string
}

type DatabaseConfig struct {
	MongoDB_URI string
	DBName      string
}

type JwtConfig struct {
	JWT_SECRET      string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JwtConfig
}

func Load() *Config {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal(".env file not found")
	}

	monogdb_uri := os.Getenv("MONGODB_URI")
	if monogdb_uri == "" {
		log.Fatal("MongoDB_URI is not defined in .env file")
	}

	jwt_secret := os.Getenv("JWT_SECRET")
	if jwt_secret == "" {
		log.Fatal("JWT_SECRET is not defined in .env file")
	}

	return &Config{
		ServerConfig{
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENV", "development"),
		},

		DatabaseConfig{
			MongoDB_URI: monogdb_uri,
			DBName:      getEnv("DB_NAME", "watchLore-dev"),
		},

		JwtConfig{
			JWT_SECRET:      jwt_secret,
			AccessTokenTTL:  mustParseDuration(getEnv("ACCESS_TOKEN_TTL", "20m")),
			RefreshTokenTTL: mustParseDuration(getEnv("REFRESH_TOKEN_TTL", "3d")),
		},
	}
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok {
		return v
	}

	return fallback
}

func mustParseDuration(s string) time.Duration {
	d, err := time.ParseDuration(s)
	if err != nil {
		log.Printf("failed to parse AccessTokenTTL into time format: %v", err)
	}

	return d
}
