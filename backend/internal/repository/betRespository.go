package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type BetRepository struct {
	db *gorm.DB
}

func NewBetRepository(db *gorm.DB) *BetRepository {
	return &BetRepository{
		db: db,
	}
}

func (r *BetRepository) ListBets(ctx context.Context) ([]model.Bet, error) {
	var bets []model.Bet
	result := r.db.WithContext(ctx).Find(&bets)
	if result.Error != nil {
		return bets, nil
	}
	return bets, result.Error
}

func (r *BetRepository) CreateBet(ctx context.Context, tx *gorm.DB, bet *model.Bet) error {
	db := r.db
	if tx != nil {
		db = tx
	}
	return db.WithContext(ctx).Create(bet).Error
}
func (r *BetRepository) GetBetByUserID(ctx context.Context, tx *gorm.DB, userID uint) (*model.Bet, error) {
	db := r.db
	if tx != nil {
		db = tx
	}
	var bet model.Bet
	err := db.WithContext(ctx).Where("user_id = ?", userID).First(&bet).Error
	return &bet, err
}

//	func (r *OutcomeRepository) GetOutcomeByID(ctx context.Context, tx *gorm.DB, id uint) (*model.Outcome, error) {
//		db := r.db
//		if tx != nil {
//			db = tx
//		}
//		var outcome model.Outcome
//		err := db.WithContext(ctx).Where("id = ?", id).First(&outcome).Error
//		return &outcome, err
//	}
func (r *BetRepository) GetBetByID(ctx context.Context, tx *gorm.DB, betID uint) (*model.Bet, error) {
	db := r.db
	if tx != nil {
		db = tx
	}
	var bet model.Bet
	err := db.WithContext(ctx).Where("id = ?", betID).First(&bet).Error
	return &bet, err
}

func (r *BetRepository) DeleteBet(ctx context.Context, id uint) error {

	result := r.db.WithContext(ctx).Delete(model.Bet{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *BetRepository) UpdateBet(ctx context.Context, tx *gorm.DB, id uint, newBet *model.Bet) error {
	db := r.db
	if tx != nil {
		db = tx
	}

	err := db.WithContext(ctx).Model(&model.Bet{}).Where("id = ?", id).Updates(newBet).Error

	return err
}
