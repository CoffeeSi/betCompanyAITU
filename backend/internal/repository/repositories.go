package repository

import "gorm.io/gorm"

type Repositories struct {
	Wallet *WalletRepository
	User   *UserRepository
	Sport  *SportRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		Wallet: NewWalletRepository(db),
		User:   NewUserRepository(db),
		Sport:  NewSportRepository(db),
	}
}
