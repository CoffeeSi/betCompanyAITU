package model

import (
	"time"
)

type Bet struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	User      User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Status    string    `json:"status" gorm:"not null;check:status IN ('pending', 'won', 'lost')"`
	CreatedAt time.Time `json:"start_time" gorm:"autoCreateTime"`
}
