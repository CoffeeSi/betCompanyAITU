package model

import (
	"time"

	"gorm.io/gorm"
)

type Bet struct {
	gorm.Model
	UserID    uint      `json:"user_id" gorm:"not null"`
	User      User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Status    string    `json:"status" gorm:"not null;check:status IN ('pending', 'won', 'lost')"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}
