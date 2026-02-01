package model

type Market struct {
	ID         uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	EventID    uint   `json:"event_id" gorm:"not null"`
	Event      Event  `json:"events" gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE"`
	MarketType string `json:"market_type" gorm:"not null"`
	Status     string `json:"status" gorm:"not null"`
}
