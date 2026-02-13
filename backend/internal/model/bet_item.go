package model

type BetItem struct {
	ID        uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	BetID     uint    `json:"bet_id" gorm:"not null"`
	Bet       Bet     `json:"bets" gorm:"foreignKey:BetID;constraint:OnDelete:CASCADE"`
	OutcomeID uint    `json:"outcome_id" gorm:"not null"`
	Outcome   Outcome `json:"outcomes" gorm:"foreignKey:OutcomeID;constraint:OnDelete:CASCADE"`
	Odds      float64 `json:"odds" gorm:"not null"`
	Amount    float64 `json:"amount" gorm:"not null"`
}
