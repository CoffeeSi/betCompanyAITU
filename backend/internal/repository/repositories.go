package repository

import "gorm.io/gorm"

type Repositories struct {
<<<<<<< HEAD
	Postgre   *PostgresRepository
=======
	Postgres  *PostgresRepository
>>>>>>> da2f9ddc77fe4d7844b8dd969cdde64374d4a824
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
<<<<<<< HEAD
		Postgre:   NewRepository(db),
=======
		Postgres:  NewRepository(db),
>>>>>>> da2f9ddc77fe4d7844b8dd969cdde64374d4a824
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
