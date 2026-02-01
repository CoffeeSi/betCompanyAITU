package handler

import "github.com/CoffeeSi/betCompanyAITU/internal/service"

// Container holds all handler instances
type Container struct {
	User   *UserHandler
	Wallet *WalletHandler
	Sport  *SportHandler
	Team   *TeamHandler
	Event  *EventHandler
}

// NewContainer initializes all handlers with their dependencies
func NewContainer(services *service.Services) *Container {
	return &Container{
		User:   NewUserHandler(services.User),
		Wallet: NewWalletHandler(services.Wallet),
		Sport:  NewSportHandler(services.Sport),
		Team:   NewTeamHandler(services.Team),
		Event:  NewEventHandler(services.Event),
	}
}
