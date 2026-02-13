package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type SportRepository struct {
	db *gorm.DB
}

func NewSportRepository(db *gorm.DB) *SportRepository {
	return &SportRepository{
		db: db,
	}
}

func (r *SportRepository) ListSports(ctx context.Context) ([]model.Sport, error) {
	var sports []model.Sport
	err := r.db.WithContext(ctx).Find(&sports).Error
	if err != nil {
		return nil, err
	}
	return sports, nil
}
