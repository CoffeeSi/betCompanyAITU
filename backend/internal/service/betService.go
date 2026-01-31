package service

import (
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type BetService struct {
	repo *repository.BetRepository
}

func NewBetService(repo *repository.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}
