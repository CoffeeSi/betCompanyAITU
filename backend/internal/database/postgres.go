package database

import (
	"fmt"
	"os"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	DB *gorm.DB
}

func NewDatabase() (*Database, error) {
	godotenv.Load()

	dns := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
		os.Getenv("SSLMODE"),
	)

	db, err := gorm.Open(postgres.Open(dns), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(
		&model.User{},
		&model.Wallet{},
		&model.Transaction{},
		&model.Sport{},
		&model.Team{},
		&model.Event{},
		&model.EventTeam{},
		&model.Market{},
		&model.Outcome{},
		&model.Bet{},
		&model.BetItem{},
	)
	return &Database{
		DB: db,
	}, nil
}
