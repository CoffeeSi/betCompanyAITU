package service

import "github.com/CoffeeSi/betCompanyAITU/internal/repository"

type Services struct {
	Wallet *WalletService
	User   *UserService
	Sport  *SportService
}

func NewServices(repos *repository.Repositories) *Services {
	return &Services{
		Wallet: NewWalletService(repos.Wallet),
		User:   NewUserService(repos.User, repos.Wallet),
		Sport:  NewSportService(repos.Sport),
	}
}
