package service

import (
	"context"

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
