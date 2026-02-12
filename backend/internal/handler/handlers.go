package handler

import "github.com/CoffeeSi/betCompanyAITU/internal/service"

// Container holds all handler instances
type Handlers struct {
	User      *UserHandler
	Wallet    *WalletHandler
	Sport     *SportHandler
	Team      *TeamHandler
	Event     *EventHandler
	EventTeam *EventTeamHandler
	Bet       *BetHandler
<<<<<<< HEAD
=======
	Outcome   *OutcomeHandler
>>>>>>> da2f9ddc77fe4d7844b8dd969cdde64374d4a824
}

// NewHandlers initializes all handlers with their dependencies
func NewHandlers(services *service.Services) *Handlers {
	return &Handlers{
		User:      NewUserHandler(services.User),
		Wallet:    NewWalletHandler(services.Wallet),
		Sport:     NewSportHandler(services.Sport),
		Team:      NewTeamHandler(services.Team),
		Event:     NewEventHandler(services.Event),
		EventTeam: NewEventTeamHandler(services.EventTeam),
		Bet:       NewBetHandler(services.Bet),
<<<<<<< HEAD
=======
		Outcome:   NewOutcomeHandler(services.Outcome),
>>>>>>> da2f9ddc77fe4d7844b8dd969cdde64374d4a824
	}
}
