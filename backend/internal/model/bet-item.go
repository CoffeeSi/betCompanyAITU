package model

import (
	"gorm.io/gorm"
)

type BetItem struct {
	gorm.Model
	BetID     uint    `json:"bet_id" gorm:"not null"`
	Bet       Bet     `json:"bets" gorm:"foreignKey:BetID;constraing:OnDelete:CASCADE"`
	OutcomeID uint    `json:"outcome_id" gorm:"not null"`
	Outcome   Outcome `json:"outcomes" gorm:"foreignKey:OutcomeID;constraint:OnDelete:CASCADE"`
}
