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

func (r *BetRepository) CreateBet(ctx context.Context, bet *model.Bet) error {
	result := r.db.WithContext(ctx).Create(&bet)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *BetRepository) GetBetByUserID(userID string) (*model.Bet, error) {
	var bet model.Bet
	err := r.db.Where("user_id = ?", userID).First(&bet).Error
	if err != nil {
		return nil, err
	}
	return &bet, nil
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

func (r *BetRepository) UpdateBet(ctx context.Context, id uint, newBet *model.Bet) error {

	result := r.db.WithContext(ctx).Model(&model.Bet{}).Where("id = ?", id).Updates(newBet)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
