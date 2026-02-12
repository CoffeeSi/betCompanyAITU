package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type OutcomeRepository struct {
	db *gorm.DB
}

func NewOutcomeRepository(db *gorm.DB) *OutcomeRepository {
	return &OutcomeRepository{
		db: db,
	}
}

func (r *OutcomeRepository) ListOutcomes(ctx context.Context) ([]model.Outcome, error) {
	var Outcomes []model.Outcome
	result := r.db.WithContext(ctx).Find(&Outcomes)
	if result.Error != nil {
		return Outcomes, nil
	}
	return Outcomes, result.Error
}

func (r *OutcomeRepository) CreateOutcome(ctx context.Context, Outcome *model.Outcome) error {
	result := r.db.WithContext(ctx).Create(&Outcome)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *OutcomeRepository) GetOutcomeByID(ctx context.Context, tx *gorm.DB, id uint) (*model.Outcome, error) {
	db := r.db
	if tx != nil {
		db = tx
	}
	var outcome model.Outcome
	err := db.WithContext(ctx).Where("id = ?", id).First(&outcome).Error
	return &outcome, err
}

func (r *OutcomeRepository) DeleteOutcome(ctx context.Context, id uint) error {

	result := r.db.WithContext(ctx).Delete(model.Outcome{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *OutcomeRepository) UpdateOutcome(ctx context.Context, id uint, newOutcome *model.Outcome) error {

	result := r.db.WithContext(ctx).Model(&model.Outcome{}).Where("id = ?", id).Updates(newOutcome)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *OutcomeRepository) UpdateOutcomeOdds(ctx context.Context, id uint, odds float64) error {
	result := r.db.WithContext(ctx).Model(&model.Outcome{}).Where("id = ?", id).Update("odds", odds)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
