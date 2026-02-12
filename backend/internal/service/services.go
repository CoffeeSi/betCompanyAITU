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

	betService := NewBetService(
		repos.Postgres,
		repos.Bet,
		repos.BetItem,
		repos.Outcome,
		repos.Wallet,
	)

	eventService := NewEventService(
		repos.Postgres,
		repos.Event,
		repos.Market,
		repos.Outcome,
		betService,
	)

	return &Services{
		Wallet:    NewWalletService(repos.Wallet),
		User:      NewUserService(repos.User, repos.Wallet),
		Sport:     NewSportService(repos.Sport),
		Team:      NewTeamService(repos.Team),
		Event:     eventService,
		EventTeam: NewEventTeamService(repos.EventTeam),
		Bet:       betService,
		Outcome:   NewOutcomeService(repos.Outcome),
	}
}
