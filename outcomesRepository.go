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
	return &OutcomeRepository{db: db}
}

func (r *OutcomeRepository) GetOutcomeByID(ctx context.Context, tx *gorm.DB, id uint) (*model.Outcome, error) {
	db := r.db
	if tx != nil {
		db = tx
	}
	var outcome model.Outcome
	err := db.WithContext(ctx).First(&outcome, id).Error
	return &outcome, err
}

func (r *OutcomeRepository) GetByMarketID(ctx context.Context, marketID uint) ([]model.Outcome, error) {
	return r.GetByMarketIDTx(ctx, nil, marketID)
}

func (r *OutcomeRepository) GetByMarketIDTx(ctx context.Context, tx *gorm.DB, marketID uint) ([]model.Outcome, error) {
	var outcomes []model.Outcome
	db := r.db
	if tx != nil {
		db = tx
	}
	err := db.WithContext(ctx).Where("market_id = ?", marketID).Find(&outcomes).Error
	return outcomes, err
}

func (r *OutcomeRepository) CreateOutcome(ctx context.Context, tx *gorm.DB, outcome *model.Outcome) error {
	db := r.db
	if tx != nil {
		db = tx
	}
	return db.WithContext(ctx).Create(outcome).Error
}

func (r *OutcomeRepository) UpdateOutcomeOdds(ctx context.Context, id uint, odds float64) error {
	return r.UpdateOutcomeOddsTx(ctx, nil, id, odds)
}

func (r *OutcomeRepository) UpdateOutcomeOddsTx(ctx context.Context, tx *gorm.DB, id uint, odds float64) error {
	db := r.db
	if tx != nil {
		db = tx
	}

	result := db.WithContext(ctx).Model(&model.Outcome{}).Where("id = ?", id).Update("odds", odds)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *OutcomeRepository) GetMarketByOutcomeID(ctx context.Context, tx *gorm.DB, outcomeID uint) (*model.Market, error) {
	db := r.db
	if tx != nil {
		db = tx
	}
	var outcome model.Outcome
	err := db.WithContext(ctx).First(&outcome, outcomeID).Error
	if err != nil {
		return nil, err
	}
	var market model.Market
	err = db.WithContext(ctx).First(&market, outcome.MarketID).Error
	return &market, err
}
