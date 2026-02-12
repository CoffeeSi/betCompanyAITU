package service

import "github.com/CoffeeSi/betCompanyAITU/internal/repository"

type Services struct {
	Wallet    *WalletService
	User      *UserService
	Sport     *SportService
	Team      *TeamService
	Event     *EventService
	EventTeam *EventTeamService
	Bet       *BetService
	Outcome   *OutcomeService
}

func NewServices(repos *repository.Repositories) *Services {
	return &Services{
		Wallet:    NewWalletService(repos.Wallet),
		User:      NewUserService(repos.User, repos.Wallet),
		Sport:     NewSportService(repos.Sport),
		Team:      NewTeamService(repos.Team),
		Event:     NewEventService(repos.Postgres, repos.Event, repos.Market, repos.Outcome),
		EventTeam: NewEventTeamService(repos.EventTeam),
		Bet:       NewBetService(repos.Postgres, repos.Bet, repos.BetItem, repos.Outcome, repos.Wallet),
		Outcome:   NewOutcomeService(repos.Outcome),
	}
}
