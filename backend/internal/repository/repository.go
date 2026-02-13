package repository

import (
	"context"

	"gorm.io/gorm"
)

type Repository interface {
	Create() string
}

type PostgresRepository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *PostgresRepository {
	return &PostgresRepository{
		db: db,
	}
}

func (r *PostgresRepository) Transaction(
	ctx context.Context,
	fn func(tx *gorm.DB) error,
) error {
	return r.db.WithContext(ctx).Transaction(fn)
}
