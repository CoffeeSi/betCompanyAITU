package config

import (
	"os"

	"github.com/joho/godotenv"
)

type DatabaseConfig struct {
	DB_USER     string
	DB_PASSWORD string
	DB_HOST     string
	DB_PORT     string
	DB_NAME     string
}

func Load() *DatabaseConfig {
	godotenv.Load()
	return &DatabaseConfig{
		DB_USER:     os.Getenv("DB_USER"),
		DB_PASSWORD: os.Getenv("DB_PASSWORD"),
		DB_HOST:     os.Getenv("DB_HOST"),
		DB_PORT:     os.Getenv("DB_PORT"),
		DB_NAME:     os.Getenv("DB_NAME"),
	}
}
