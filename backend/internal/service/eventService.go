package service

import (
	"context"
	"errors"
	"math"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type EventService struct {
	mainRepo   *repository.PostgresRepository
	repo       *repository.EventRepository
	marketRepo *repository.MarketRepository
	outRepo    *repository.OutcomeRepository
	betService *BetService
}

func NewEventService(mainRepo *repository.PostgresRepository, eventRepo *repository.EventRepository, marketRepo *repository.MarketRepository, outRepo *repository.OutcomeRepository, betService *BetService,
) *EventService {
	return &EventService{
		mainRepo:   mainRepo,
		repo:       eventRepo,
		marketRepo: marketRepo,
		outRepo:    outRepo,
		betService: betService,
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
					MarketID:  market.ID,
					Selection: outcome.Selection,
					Odds:      outcome.Odds,
					Result:    "pending",
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
func (s *EventService) ListEvents(page, pageSize int) (*dto.EventsResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	events, total, err := s.repo.ListEvents(context.Background(), page, pageSize)
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

func (s *EventService) ListEventsPaginated(page, pageSize int, sportID *uint) (*dto.EventsResponse, error) {
	if sportID != nil {
		return s.ListEventsBySport(*sportID, page, pageSize)
	}
	return s.ListEvents(page, pageSize)
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

	event.ID = existing.ID
	return s.repo.UpdateEvent(context.Background(), event)
}

func (s *EventService) DeleteEvent(id uint) error {
	return s.repo.DeleteEvent(context.Background(), id)
}
func (s *EventService) FinishEvent(ctx context.Context, eventID uint, homeScore, awayScore int) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {

		var event model.Event
		if err := tx.First(&event, eventID).Error; err != nil {
			return err
		}

		if event.Status == "completed" {
			return errors.New("event already completed")
		}

		// Обновляем событие
		if err := tx.Model(&event).Updates(map[string]interface{}{
			"status":     "completed",
			"home_score": homeScore,
			"away_score": awayScore,
		}).Error; err != nil {
			return err
		}

		// Сеттим рынки
		if err := s.marketRepo.SettleMarkets(ctx, tx, eventID, homeScore, awayScore); err != nil {
			return err
		}

		// Сеттим ставки
		if err := s.betService.SettleBetsByEvent(ctx, tx, eventID); err != nil {
			return err
		}

		return nil
	})
}
