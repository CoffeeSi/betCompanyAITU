package repository

import postgres "github.com/CoffeeSi/betCompanyAITU/internal/database"

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
