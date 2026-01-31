package handler

import "github.com/CoffeeSi/betCompanyAITU/internal/service"

// Container holds all handler instances
type Container struct {
	User   *UserHandler
	Wallet *WalletHandler
	Sport  *SportHandler
}

// NewContainer initializes all handlers with their dependencies
func NewContainer(services *service.Services) *Container {
	return &Container{
		User:   NewUserHandler(services.User),
		Wallet: NewWalletHandler(services.Wallet),
		Sport:  NewSportHandler(services.Sport),
	}
}
