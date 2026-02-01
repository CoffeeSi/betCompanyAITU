package repository

import (
	postgres "github.com/CoffeeSi/betCompanyAITU/internal/database"
	"gorm.io/gorm"
)

type Repository interface {
	Create() string
}

type PostgresRepository struct {
	db *postgres.Database
}

func NewRepository(database *postgres.Database) *PostgresRepository {
	return &PostgresRepository{
		db: database,
	}
}

func (r *PostgresRepository) Transaction(fn func(tx *gorm.DB) error) error {
	return r.db.DB.Transaction(fn)
}
