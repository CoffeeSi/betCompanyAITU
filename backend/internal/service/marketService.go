package service

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type MarketService struct {
	repo       *repository.MarketRepository
	mainRepo   *repository.PostgresRepository
	marketRepo *repository.MarketRepository
	outRepo    *repository.OutcomeRepository
}

func NewMarketService(repo *repository.MarketRepository) *MarketService {
	return &MarketService{repo: repo}
}
func (s *MarketService) CreateMarketWithOutcomes(ctx context.Context, eventID uint, marketType string, outcomesDTO []model.Outcome) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {
		market := &model.Market{
			EventID:    eventID,
			MarketType: marketType,
			Status:     "active",
		}
		if err := s.marketRepo.CreateMarket(ctx, tx, market); err != nil {
			return err
		}

		for _, oc := range outcomesDTO {
			oc.MarketID = market.ID
			if err := s.outRepo.CreateOutcome(ctx, tx, &oc); err != nil {
				return err
			}
		}
		return nil
	})
}

func (s *MarketService) GetFormattedMarkets(ctx, eventID uint) ([]dto.MarketOddsResponse, error) {
	markets, err := s.repo.GetMarketsByEventID(context.Background(), eventID)
	if err != nil {
		return nil, err
	}

	// 2. Преобразуем в нужный формат
	var response []dto.MarketOddsResponse

	for _, m := range markets {
		oddsMap := make(map[string]float64)

		for _, outcome := range m.Outcomes {
			oddsMap[outcome.Selection] = outcome.Odds
		}

		response = append(response, dto.MarketOddsResponse{
			MarketID:   m.ID,
			MarketType: m.MarketType,
			Odds:       oddsMap,
		})
	}

	return response, nil
}

func (s *MarketService) SettleMarkets(ctx context.Context, tx *gorm.DB, eventID uint, homeScore, awayScore int) error {
	var markets []model.Market
	if err := tx.Where("event_id = ?", eventID).Preload("Outcomes").Find(&markets).Error; err != nil {
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
				if o.Selection == "Over 2.5" && float64(homeScore+awayScore) > 2.5 {
					isWin = true
				}
				if o.Selection == "Under 2.5" && float64(homeScore+awayScore) < 2.5 {
					isWin = true
				}
			}

			status := "lost"
			if isWin {
				status = "won"
			}
			if err := tx.Model(&o).Update("result", status).Error; err != nil {
				return err
			}
		}
	}
	return nil
}
