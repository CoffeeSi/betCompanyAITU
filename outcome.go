package model

type Outcome struct {
	ID       uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	MarketID uint    `json:"market_id" gorm:"not null"`
	Market   Market  `json:"markets" gorm:"foreignKey:MarketID;constraint:OnDelete:CASCADE"`
	TeamID   *uint   `json:"team_id" gorm:""`
	Team     *Team   `json:"teams" gorm:"foreignKey:TeamID;constraint:OnDelete:CASCADE"`
	Odds     float64 `json:"odds" gorm:"not null"`
	Result   string  `json:"result" gorm:"not null"`
}
