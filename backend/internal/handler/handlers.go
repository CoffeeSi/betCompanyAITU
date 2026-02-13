// @Summary Create user
// @Description Register new user
// @Tags Users
// @Accept json
// @Produce json
// @Param user body dto.User true "User data"
// @Success 200 {object} dto.User
// @Router /users [post]

package handler

import "github.com/CoffeeSi/betCompanyAITU/internal/service"

type Handlers struct {
	User      *UserHandler
	Wallet    *WalletHandler
	Sport     *SportHandler
	Team      *TeamHandler
	Event     *EventHandler
	EventTeam *EventTeamHandler
	Bet       *BetHandler
	Outcome   *OutcomeHandler
	Market    *MarketHandler
}

func NewHandlers(services *service.Services) *Handlers {
	return &Handlers{
		User:      NewUserHandler(services.User),
		Wallet:    NewWalletHandler(services.Wallet),
		Sport:     NewSportHandler(services.Sport),
		Team:      NewTeamHandler(services.Team),
		Event:     NewEventHandler(services.Event),
		EventTeam: NewEventTeamHandler(services.EventTeam),
		Bet:       NewBetHandler(services.Bet),
		Outcome:   NewOutcomeHandler(services.Outcome),
		Market:    NewMarketHandler(services.Market),
	}
}
