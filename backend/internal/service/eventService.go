package service

import (
	"context"
	"errors"
	"fmt"
	"math"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type EventService struct {
	mainRepo    *repository.PostgresRepository
	repo        *repository.EventRepository
	marketRepo  *repository.MarketRepository
	outRepo     *repository.OutcomeRepository
	betRepo     *repository.BetRepository
	betItemRepo *repository.BetItemRepository
	walletRepo  *repository.WalletRepository
}

func NewEventService(
	mainRepo *repository.PostgresRepository,
	eventRepo *repository.EventRepository,
	marketRepo *repository.MarketRepository,
	outRepo *repository.OutcomeRepository,
	betRepo *repository.BetRepository,
	betItemRepo *repository.BetItemRepository,
	walletRepo *repository.WalletRepository,
) *EventService {
	return &EventService{
		mainRepo:    mainRepo,
		repo:        eventRepo,
		marketRepo:  marketRepo,
		outRepo:     outRepo,
		betRepo:     betRepo,
		betItemRepo: betItemRepo,
		walletRepo:  walletRepo,
	}
}

func (s *EventService) CreateComplexEvent(ctx context.Context, req dto.CreateEventRequest) (*model.Event, error) {
	var event *model.Event

	err := s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {
		event = &model.Event{
			SportID:   req.SportID,
			StartTime: req.StartTime,
			Status:    "scheduled",
		}
		if err := tx.Create(event).Error; err != nil {
			return err
		}

		if err := tx.Exec("INSERT INTO event_teams (event_id, team_id) VALUES (?, ?), (?, ?)",
			event.ID, req.HomeTeamID, event.ID, req.AwayTeamID).Error; err != nil {
			return err
		}

		for marketName, outcomes := range req.Markets {
			market := &model.Market{
				EventID:    event.ID,
				MarketType: marketName,
				Status:     "active",
			}
			if err := tx.Create(market).Error; err != nil {
				return err
			}

			for _, outcome := range outcomes {
				outcome := &model.Outcome{
					MarketID: market.ID,
					Odds:     outcome.Odds,
					Result:   "pending",
				}
				if err := tx.Create(outcome).Error; err != nil {
					return err
				}
			}
		}
		return nil
	})

	return event, err
}
func (s *EventService) ListEvents(page, pageSize int, status *string) (*dto.EventsResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	events, total, err := s.repo.ListEvents(context.Background(), page, pageSize, status)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	return &dto.EventsResponse{
		Events:     events,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *EventService) ListEventsBySport(sportID uint, page, pageSize int) (*dto.EventsResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	events, total, err := s.repo.ListEventsBySport(context.Background(), sportID, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	return &dto.EventsResponse{
		Events:     events,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *EventService) ListEventsByTeam(teamID uint, page, pageSize int) (*dto.EventsResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	events, total, err := s.repo.ListEventsByTeam(context.Background(), teamID, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	return &dto.EventsResponse{
		Events:     events,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *EventService) ListEventsPaginated(page, pageSize int, sportID *uint, status *string) (*dto.EventsResponse, error) {
	if sportID != nil {
		return s.ListEventsBySport(*sportID, page, pageSize)
	}
	return s.ListEvents(page, pageSize, status)
}

func (s *EventService) GetEventByID(id uint) (*model.Event, error) {
	return s.repo.GetEventByID(context.Background(), id)
}

func (s *EventService) CreateEvent(event *model.Event) error {
	if event.SportID == 0 {
		return errors.New("sport_id is required")
	}
	if event.Status == "" {
		event.Status = "scheduled"
	}
	return s.repo.CreateEvent(context.Background(), event)
}

func (s *EventService) UpdateEvent(id uint, event *model.Event) error {
	existing, err := s.repo.GetEventByID(context.Background(), id)
	if err != nil {
		return err
	}

	if event.Name == "" {
		event.Name = existing.Name
	}
	if event.SportID == 0 {
		event.SportID = existing.SportID
	}
	if event.Status == "" {
		event.Status = existing.Status
	}
	if event.StartTime.IsZero() {
		event.StartTime = existing.StartTime
	}

	event.ID = existing.ID
	return s.repo.UpdateEvent(context.Background(), event)
}

func (s *EventService) DeleteEvent(id uint) error {
	return s.repo.DeleteEvent(context.Background(), id)
}

func (s *EventService) UpdateEventStatus(id uint, status string) error {
	ctx := context.Background()
	event, err := s.repo.GetEventByID(ctx, id)
	if err != nil {
		return err
	}

	if event.Status == "completed" && status == "ongoing" {
		if err := s.UndoEventSettlement(ctx, id); err != nil {
			return fmt.Errorf("failed to undo settlements: %w", err)
		}
	}

	event.Status = status
	return s.repo.UpdateEvent(ctx, event)
}

func (s *EventService) GetMarketsByEventID(eventID uint) ([]model.Market, error) {
	return s.marketRepo.ListMarketsByEventID(context.Background(), eventID)
}

func (s *EventService) GetCompletedEvents() ([]model.Event, error) {
	return s.repo.GetEventsByStatus(context.Background(), "completed")
}

func (s *EventService) GetEventOutcomes(eventID uint) ([]model.Outcome, error) {
	markets, err := s.marketRepo.ListMarketsByEventID(context.Background(), eventID)
	if err != nil {
		return nil, err
	}

	var allOutcomes []model.Outcome
	for _, market := range markets {
		outcomes, err := s.outRepo.GetByMarketID(context.Background(), market.ID)
		if err != nil {
			continue
		}

		for i := range outcomes {
			outcomes[i].Market = market
		}
		allOutcomes = append(allOutcomes, outcomes...)
	}

	return allOutcomes, nil
}

func (s *EventService) SettleEvent(ctx context.Context, eventID uint, winningOutcomeIDs []uint) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {
		markets, err := s.marketRepo.ListMarketsByEventID(ctx, eventID)
		if err != nil {
			return err
		}

		winningMap := make(map[uint]uint)
		for _, outcomeID := range winningOutcomeIDs {
			outcome, err := s.outRepo.GetOutcomeByID(ctx, tx, outcomeID)
			if err != nil {
				return errors.New("outcome not found")
			}
			winningMap[outcome.MarketID] = outcomeID
		}

		var betItems []model.BetItem
		for _, market := range markets {
			outcomes, err := s.outRepo.GetByMarketIDTx(ctx, tx, market.ID)
			if err != nil {
				continue
			}
			for _, outcome := range outcomes {
				items, err := s.betItemRepo.GetByOutcomeID(ctx, tx, outcome.ID)
				if err != nil {
					continue
				}
				betItems = append(betItems, items...)
			}
		}

		betMap := make(map[uint][]model.BetItem)
		for _, item := range betItems {
			betMap[item.BetID] = append(betMap[item.BetID], item)
		}

		for betID, items := range betMap {
			bet, err := s.betRepo.GetBetByID(ctx, tx, betID)
			if err != nil || bet.Status != "pending" {
				continue
			}

			isWinner := true
			for _, item := range items {
				outcome, err := s.outRepo.GetOutcomeByID(ctx, tx, item.OutcomeID)
				if err != nil {
					isWinner = false
					break
				}

				if winningMap[outcome.MarketID] != item.OutcomeID {
					isWinner = false
					break
				}
			}

			if isWinner {
				bet.Status = "win"
				winAmount := bet.Amount * bet.TotalOdd
				if _, _, err := s.walletRepo.Win(ctx, tx, bet.UserID, winAmount); err != nil {
					return err
				}
			} else {
				bet.Status = "lost"
			}

			if err := s.betRepo.UpdateBet(ctx, tx, betID, bet); err != nil {
				return err
			}
		}

		if err := s.marketRepo.CloseMarketsByEventID(ctx, tx, eventID); err != nil {
			return fmt.Errorf("failed to close markets: %w", err)
		}

		return nil
	})
}

func (s *EventService) UndoEventSettlement(ctx context.Context, eventID uint) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {
		markets, err := s.marketRepo.ListMarketsByEventID(ctx, eventID)
		if err != nil {
			return err
		}

		var betItems []model.BetItem
		for _, market := range markets {
			outcomes, err := s.outRepo.GetByMarketIDTx(ctx, tx, market.ID)
			if err != nil {
				continue
			}
			for _, outcome := range outcomes {
				items, err := s.betItemRepo.GetByOutcomeID(ctx, tx, outcome.ID)
				if err != nil {
					continue
				}
				betItems = append(betItems, items...)
			}
		}

		betMap := make(map[uint][]model.BetItem)
		for _, item := range betItems {
			betMap[item.BetID] = append(betMap[item.BetID], item)
		}

		for betID := range betMap {
			bet, err := s.betRepo.GetBetByID(ctx, tx, betID)
			if err != nil {
				continue
			}

			if bet.Status == "win" {
				winAmount := bet.Amount * bet.TotalOdd
				if _, _, err := s.walletRepo.Withdraw(ctx, tx, bet.UserID, winAmount); err != nil {
					return fmt.Errorf("failed to refund winnings: %w", err)
				}
				bet.Status = "pending"
			} else if bet.Status == "lost" {
				bet.Status = "pending"
			}

			if bet.Status == "pending" {
				if err := s.betRepo.UpdateBet(ctx, tx, betID, bet); err != nil {
					return err
				}
			}
		}

		for _, market := range markets {
			market.Status = "active"
			if err := s.marketRepo.UpdateMarket(ctx, tx, market.ID, &market); err != nil {
				return fmt.Errorf("failed to reopen market %d: %w", market.ID, err)
			}
		}

		return nil
	})
}
