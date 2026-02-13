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
	Market    *MarketService
}

func NewServices(repos *repository.Repositories) *Services {
	return &Services{
		Wallet:    NewWalletService(repos.Wallet),
		User:      NewUserService(repos.User, repos.Wallet),
		Sport:     NewSportService(repos.Sport),
		Team:      NewTeamService(repos.Team),
		Event:     NewEventService(repos.Postgres, repos.Event, repos.Market, repos.Outcome, repos.Bet, repos.BetItem, repos.Wallet),
		EventTeam: NewEventTeamService(repos.EventTeam),
		Bet:       NewBetService(repos.Postgres, repos.Bet, repos.BetItem, repos.Outcome, repos.Wallet, repos.Event),
		Outcome:   NewOutcomeService(repos.Outcome),
		Market:    NewMarketService(repos.Postgres, repos.Market, repos.Outcome, repos.Event),
	}
}
