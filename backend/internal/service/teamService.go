package service

import (
	"context"
	"errors"
	"math"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
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

func (s *TeamService) ListTeamsBySport(sportID uint, page, pageSize int) (*dto.TeamsResponse, error) {
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

func (s *TeamService) GetTeamByID(teamID uint) (*dto.TeamResponse, error) {
	team, err := s.repo.GetTeamByID(context.Background(), teamID)
	if err != nil {
		return nil, err
	}

	return &dto.TeamResponse{Team: team}, nil
}

func (s *TeamService) CreateTeam(req dto.CreateTeamRequest) (*model.Team, error) {
	if req.Name == "" {
		return nil, errors.New("name is required")
	}
	if req.LogoURL == "" {
		return nil, errors.New("logo_url is required")
	}
	if req.SportID == 0 {
		return nil, errors.New("sport_id is required")
	}

	team := &model.Team{
		Name:    req.Name,
		LogoUrl: req.LogoURL,
		SportID: req.SportID,
	}

	if err := s.repo.CreateTeam(context.Background(), team); err != nil {
		return nil, err
	}

	return team, nil
}

func (s *TeamService) UpdateTeam(id uint, req dto.UpdateTeamRequest) (*model.Team, error) {
	existing, err := s.repo.GetTeamByID(context.Background(), id)
	if err != nil {
		return nil, err
	}

	existing.Name = req.Name
	existing.LogoUrl = req.LogoURL
	existing.SportID = req.SportID

	if err := s.repo.UpdateTeam(context.Background(), existing); err != nil {
		return nil, err
	}

	return existing, nil
}

func (s *TeamService) DeleteTeam(id uint) error {
	if _, err := s.repo.GetTeamByID(context.Background(), id); err != nil {
		return err
	}
	return s.repo.DeleteTeam(context.Background(), id)
}
