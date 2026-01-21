package service

import "github.com/CoffeeSi/betCompanyAITU/internal/repository"

type Service struct {
	repository *repository.PostgresRepository
}

func NewService(repository *repository.PostgresRepository) *Service {
	return &Service{
		repository: repository,
	}
}
