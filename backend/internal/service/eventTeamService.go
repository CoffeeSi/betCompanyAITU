package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type EventTeamService struct {
	repo *repository.EventTeamRepository
}

func NewEventTeamService(repo *repository.EventTeamRepository) *EventTeamService {
	return &EventTeamService{repo: repo}
}

func (s *EventTeamService) GetTeamsByEvent(eventID string) (dto.EventTeamResponse, error) {
	return s.repo.GetTeamsByEvent(context.Background(), eventID)
}

func (s *EventTeamService) AssignTeamsToEvent(eventID uint, teams []dto.AssignTeamRequest) error {
	ctx := context.Background()

	// Проверяем, что событие существует
	eventExists, err := s.repo.CheckEventExists(ctx, eventID)
	if err != nil {
		return fmt.Errorf("failed to check event existence: %w", err)
	}
	if !eventExists {
		return errors.New("event not found")
	}

	// Проверяем количество команд
	if len(teams) != 2 {
		return errors.New("exactly 2 teams required (home and away)")
	}

	// Проверяем, что роли уникальны
	roles := make(map[string]bool)
	teamIDs := make(map[uint]bool)
	for _, team := range teams {
		if roles[team.Role] {
			return fmt.Errorf("duplicate role: %s", team.Role)
		}
		roles[team.Role] = true

		if teamIDs[team.TeamID] {
			return fmt.Errorf("duplicate team_id: %d", team.TeamID)
		}
		teamIDs[team.TeamID] = true

		// Проверяем, что команда существует
		teamExists, err := s.repo.CheckTeamExists(ctx, team.TeamID)
		if err != nil {
			return fmt.Errorf("failed to check team existence: %w", err)
		}
		if !teamExists {
			return fmt.Errorf("team with id %d not found", team.TeamID)
		}

		// Проверяем event_id в запросе
		if team.EventID != eventID {
			return fmt.Errorf("team event_id %d does not match event id %d", team.EventID, eventID)
		}
	}

	// Проверяем наличие обеих ролей
	if !roles["home"] || !roles["away"] {
		return errors.New("both 'home' and 'away' roles are required")
	}

	return s.repo.AssignTeamsToEvent(ctx, eventID, teams)
}
