package service

import "github.com/CoffeeSi/betCompanyAITU/internal/repository"

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}
