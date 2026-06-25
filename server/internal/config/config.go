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

type ImagekitConfig struct {
	ImgPvtKey string
	ImgPubKey string
	ImgURL    string
}

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JwtConfig
	ImageKit ImagekitConfig
	TMDB     TMDBConfig
}

type TMDBConfig struct {
	TMDB_KEY string
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

	imgkitPvtKey := os.Getenv("ImageKitPrivateKey")
	if imgkitPvtKey == "" {
		log.Fatal("ImageKitPrivateKey is not defined in .env file")
	}

	imgKitPubKey := os.Getenv("ImageKitPublicKey")
	if imgKitPubKey == "" {
		log.Fatal("ImageKitPublicKey is not defined in .env file")
	}

	imgKitURL := os.Getenv("ImageKitURL")
	if imgKitURL == "" {
		log.Fatal("ImageKitURL is not defined in .env file")
	}

	tmdbKey := os.Getenv("TMDB_API_KEY")
	if tmdbKey == "" {
		log.Println("Warning: TMDB_ACCESS_TOKEN is not defined in .env file. Content discovery will be unavailable.")
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

		ImagekitConfig{
			ImgPvtKey: imgkitPvtKey,
			ImgPubKey: imgKitPubKey,
			ImgURL:    imgKitURL,
		},

		TMDBConfig{
			TMDB_KEY: tmdbKey,
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
