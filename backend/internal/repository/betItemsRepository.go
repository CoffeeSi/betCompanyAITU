package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type BetItemRepository struct {
	db *gorm.DB
}

func NewBetItemRepository(db *gorm.DB) *BetItemRepository {
	return &BetItemRepository{
		db: db,
	}
}

func (r *BetItemRepository) ListBetItems(ctx context.Context) ([]model.BetItem, error) {
	var BetItems []model.BetItem
	result := r.db.WithContext(ctx).Find(&BetItems)
	if result.Error != nil {
		return nil, result.Error
	}
	return BetItems, nil
}
func (r *BetItemRepository) CreateBetItems(ctx context.Context, tx *gorm.DB, betItem *model.BetItem) error {
	db := r.db
	if tx != nil {
		db = tx
	}
	return db.WithContext(ctx).Create(betItem).Error
}

func (r *BetItemRepository) GetBetItemsByBetID(betID uint) (*[]model.BetItem, error) {
	var betItem []model.BetItem
	err := r.db.Where("bet_id = ?", betID).Find(&betItem).Error
	if err != nil {
		return nil, err
	}
	return &betItem, err
}

func (r *BetItemRepository) DeleteBetItems(ctx context.Context, id uint) error {

	result := r.db.WithContext(ctx).Delete(model.BetItem{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *BetItemRepository) UpdateBetItems(ctx context.Context, id uint, newBetItems *model.BetItem) error {

	result := r.db.WithContext(ctx).Model(&model.BetItem{}).Where("id = ?", id).Updates(newBetItems)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
