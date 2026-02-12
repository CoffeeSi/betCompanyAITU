package service

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type EventManagerService struct {
	mainRepo   *repository.PostgresRepository
	marketRepo *repository.MarketRepository
	outRepo    *repository.OutcomeRepository
}

func (s *EventManagerService) CreateMarketWithOutcomes(ctx context.Context, eventID uint, marketType string, outcomesDTO []model.Outcome) error {
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
