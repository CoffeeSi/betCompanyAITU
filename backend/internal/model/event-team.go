package model

type EventTeam struct {
	ID      uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	EventID uint   `json:"event_id" gorm:"not null"`
	Event   Event  `json:"events" gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE"`
	TeamID  uint   `json:"team_id" gorm:"not null"`
	Team    Team   `json:"teams" gorm:"foreignKey:TeamID;constraint:OnDelete:CASCADE"`
	Role    string `json:"role" gorm:"type:varchar(20);not null"` // "home" or "away"
}
