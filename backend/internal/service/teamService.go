package service

import (
	"context"
	"math"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type TeamService struct {
	repo *repository.TeamRepository
}

func NewTeamService(repo *repository.TeamRepository) *TeamService {
	return &TeamService{repo: repo}
}

func (s *TeamService) ListTeams(page, pageSize int) (*dto.TeamsResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	teams, total, err := s.repo.ListTeams(context.Background(), page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	return &dto.TeamsResponse{
		Teams:      teams,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *TeamService) ListTeamsBySport(sportID string, page, pageSize int) (*dto.TeamsResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	teams, total, err := s.repo.ListTeamsBySport(context.Background(), sportID, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	return &dto.TeamsResponse{
		Teams:      teams,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *TeamService) ListTeamsPaginated(page, pageSize int) (*dto.TeamsResponse, error) {
	return s.ListTeams(page, pageSize)
}

func (s *TeamService) GetTeamByID(teamID string) (*dto.TeamResponse, error) {
	team, err := s.repo.GetTeamByID(context.Background(), teamID)
	if err != nil {
		return nil, err
	}

	return &dto.TeamResponse{Team: team}, nil
}
