package repository

import "gorm.io/gorm"

type Repositories struct {
	Wallet    *WalletRepository
	User      *UserRepository
	Sport     *SportRepository
	Team      *TeamRepository
	Event     *EventRepository
	EventTeam *EventTeamRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		Wallet:    NewWalletRepository(db),
		User:      NewUserRepository(db),
		Sport:     NewSportRepository(db),
		Team:      NewTeamRepository(db),
		Event:     NewEventRepository(db),
		EventTeam: NewEventTeamRepository(db),
	}
}
