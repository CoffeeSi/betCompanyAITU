package service

import (
	"context"
	"errors"

	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type OutcomeService struct {
	repo *repository.OutcomeRepository
}

func NewOutcomeService(repo *repository.OutcomeRepository) *OutcomeService {
	return &OutcomeService{repo: repo}
}

func (s *OutcomeService) UpdateOdds(outcomeID uint, odds float64) error {
	if odds <= 0 {
		return errors.New("odds must be greater than zero")
	}
	return s.repo.UpdateOutcomeOdds(context.Background(), outcomeID, odds)
}
