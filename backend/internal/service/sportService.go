package service

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type SportService struct {
	repo *repository.SportRepository
}

func NewSportService(repo *repository.SportRepository) *SportService {
	return &SportService{
		repo: repo,
	}
}

func (s *SportService) ListSports() (dto.SportResponse, error) {
	sports, err := s.repo.ListSports(context.Background())
	if err != nil {
		return dto.SportResponse{}, err
	}

	sportItems := make([]dto.SportItem, len(sports))
	for i, s := range sports {
		sportItems[i] = dto.SportItem{
			ID:   s.ID,
			Name: s.Name,
		}
	}
	response := dto.SportResponse{Sports: sportItems}
	return response, nil
}
