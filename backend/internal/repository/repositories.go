package repository

import "gorm.io/gorm"

type Repositories struct {
	Postgre   *PostgresRepository
	Wallet    *WalletRepository
	User      *UserRepository
	Sport     *SportRepository
	Team      *TeamRepository
	Event     *EventRepository
	EventTeam *EventTeamRepository
	Bet       *BetRepository
	BetItem   *BetItemRepository
	Outcome   *OutcomeRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		Postgre:   NewRepository(db),
		Wallet:    NewWalletRepository(db),
		User:      NewUserRepository(db),
		Sport:     NewSportRepository(db),
		Team:      NewTeamRepository(db),
		Event:     NewEventRepository(db),
		EventTeam: NewEventTeamRepository(db),
		Bet:       NewBetRepository(db),
		BetItem:   NewBetItemRepository(db),
		Outcome:   NewOutcomeRepository(db),
	}
}
