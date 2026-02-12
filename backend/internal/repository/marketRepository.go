package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type MarketRepository struct {
	db *gorm.DB
}

func NewMarketRepository(db *gorm.DB) *MarketRepository {
	return &MarketRepository{
		db: db,
	}
}

func (r *MarketRepository) ListMarkets(ctx context.Context) ([]model.Market, error) {
	var markets []model.Market
	result := r.db.WithContext(ctx).Find(&markets)
	if result.Error != nil {
		return nil, result.Error
	}
	return markets, result.Error
}

func (r *MarketRepository) CreateMarket(ctx context.Context, tx *gorm.DB, market *model.Market) error {
	db := r.db
	if tx != nil {
		db = tx
	}
	return db.WithContext(ctx).Create(market).Error
}

func (r *MarketRepository) GetMarketsByEventID(ctx context.Context, eventID uint) ([]model.Market, error) {
	var markets []model.Market
	err := r.db.WithContext(ctx).
		Where("event_id = ?", eventID).
		Preload("Outcomes").
		Find(&markets).Error
	return markets, err
}
func (r *MarketRepository) GetMarketByID(ctx context.Context, tx *gorm.DB, marketID uint, notNull bool) (*model.Market, error) {
	db := r.db
	if tx != nil {
		db = tx
	}
	var market model.Market
	query := db.WithContext(ctx)
	if notNull {
		query = query.Preload("Outcomes")
	}
	err := query.Where("id = ?", marketID).First(&market).Error
	return &market, err
}
func (r *MarketRepository) DeleteMarket(ctx context.Context, id uint) error {

	result := r.db.WithContext(ctx).Delete(model.Market{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *MarketRepository) UpdateMarket(ctx context.Context, tx *gorm.DB, id uint, newMarket *model.Market) error {
	db := r.db
	if tx != nil {
		db = tx
	}

	err := db.WithContext(ctx).Model(&model.Market{}).Where("id = ?", id).Updates(newMarket).Error

	return err
}

func (r *MarketRepository) GetMarketWithOutcomes(ctx context.Context, marketID uint) (*model.Market, error) {
	var market model.Market
	err := r.db.WithContext(ctx).Preload("Outcomes").First(&market, marketID).Error
	return &market, err
}
func (r *MarketRepository) SettleMarkets(ctx context.Context, tx *gorm.DB, eventID uint, homeScore, awayScore int) error {

	var markets []model.Market
	if err := tx.Where("event_id = ?", eventID).
		Preload("Outcomes").
		Find(&markets).Error; err != nil {
		return err
	}

	for _, m := range markets {

		for _, o := range m.Outcomes {

			isWin := false

			switch m.MarketType {

			case "1X2":
				if homeScore > awayScore && o.Selection == "Home" {
					isWin = true
				}
				if homeScore == awayScore && o.Selection == "Draw" {
					isWin = true
				}
				if homeScore < awayScore && o.Selection == "Away" {
					isWin = true
				}

			case "Total":
				total := homeScore + awayScore
				if o.Selection == "Over 2.5" && total > 2 {
					isWin = true
				}
				if o.Selection == "Under 2.5" && total < 3 {
					isWin = true
				}
			}

			result := "lost"
			if isWin {
				result = "won"
			}

			if err := tx.Model(&o).Update("result", result).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
