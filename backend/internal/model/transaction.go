package model

import "time"

type Transaction struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	WalletID  uint      `json:"wallet_id" gorm:"not null"`
	Wallet    Wallet    `json:"wallet" gorm:"foreignKey:WalletID;constraint:OnDelete:CASCADE"`
	Type      string    `json:"type" gorm:"not null;check:type IN ('deposit', 'withdrawal')"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Status    string    `json:"status" gorm:"not null;check:status IN ('pending', 'completed', 'failed')"`
	CreatedAt time.Time `json:"start_time" gorm:"autoCreateTime"`
}
