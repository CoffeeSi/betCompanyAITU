package service

import "github.com/CoffeeSi/betCompanyAITU/internal/repository"

type Services struct {
	Wallet    *WalletService
	User      *UserService
	Sport     *SportService
	Team      *TeamService
	Event     *EventService
	EventTeam *EventTeamService
}

func NewServices(repos *repository.Repositories) *Services {
	return &Services{
		Wallet:    NewWalletService(repos.Wallet),
		User:      NewUserService(repos.User, repos.Wallet),
		Sport:     NewSportService(repos.Sport),
		Team:      NewTeamService(repos.Team),
		Event:     NewEventService(repos.Event),
		EventTeam: NewEventTeamService(repos.EventTeam),
	}
}
