package model

import (
	"time"
)

type Bet struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	User      User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Status    string    `json:"status" gorm:"not null;check:status IN ('pending', 'win', 'lost')"`
	CreatedAt time.Time `json:"start_time" gorm:"autoCreateTime"`
	Type      string    `json:"type" gorm:"not null;check:status IN ('express', 'default')"`
	TotalOdd  float64   `json:"total_odd" gorm:"not null"`
}
