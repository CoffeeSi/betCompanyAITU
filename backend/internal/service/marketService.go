package service

import (
	"context"
	"math"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type MarketService struct {
	mainRepo   *repository.PostgresRepository
	marketRepo *repository.MarketRepository
	outRepo    *repository.OutcomeRepository
	eventRepo  *repository.EventRepository
}

func NewMarketService(mainRepo *repository.PostgresRepository, marketRepo *repository.MarketRepository, outRepo *repository.OutcomeRepository, eventRepo *repository.EventRepository) *MarketService {
	return &MarketService{
		mainRepo:   mainRepo,
		marketRepo: marketRepo,
		outRepo:    outRepo,
		eventRepo:  eventRepo,
	}
}

type MarketListResponse struct {
	Markets    []MarketWithMeta `json:"markets"`
	Page       int              `json:"page"`
	PageSize   int              `json:"page_size"`
	TotalItems int64            `json:"total_items"`
	TotalPages int              `json:"total_pages"`
}

type MarketWithMeta struct {
	model.Market
	EventName     string `json:"event_name"`
	OutcomesCount int    `json:"outcomes_count"`
}

func (s *MarketService) ListMarkets(ctx context.Context, page, pageSize int) (*MarketListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	markets, err := s.marketRepo.ListMarkets(ctx)
	if err != nil {
		return nil, err
	}

	total := int64(len(markets))
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	start := (page - 1) * pageSize
	end := start + pageSize
	if start > len(markets) {
		start = len(markets)
	}
	if end > len(markets) {
		end = len(markets)
	}
	paged := markets[start:end]

	result := make([]MarketWithMeta, 0, len(paged))
	for _, m := range paged {
		meta := MarketWithMeta{
			Market:        m,
			OutcomesCount: len(m.Outcomes),
		}
		event, err := s.eventRepo.GetEventByID(ctx, m.EventID)
		if err == nil && event != nil {
			meta.EventName = event.Name
		}
		outcomes, err := s.outRepo.GetByMarketID(ctx, m.ID)
		if err == nil {
			meta.OutcomesCount = len(outcomes)
		}
		result = append(result, meta)
	}

	return &MarketListResponse{
		Markets:    result,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *MarketService) GetMarketByID(ctx context.Context, id uint) (*model.Market, error) {
	return s.marketRepo.GetMarketByID(ctx, nil, id, true)
}

func (s *MarketService) CreateMarket(ctx context.Context, market *model.Market) error {
	if market.Status == "" {
		market.Status = "active"
	}
	return s.marketRepo.CreateMarket(ctx, nil, market)
}

func (s *MarketService) UpdateMarket(ctx context.Context, id uint, market *model.Market) error {
	return s.marketRepo.UpdateMarket(ctx, nil, id, market)
}

func (s *MarketService) DeleteMarket(ctx context.Context, id uint) error {
	return s.marketRepo.DeleteMarket(ctx, id)
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
