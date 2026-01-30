package model

import (
	"gorm.io/gorm"
)

type EventTeam struct {
	gorm.Model
	EventID uint  `json:"event_id" gorm:"not null"`
	Event   Event `json:"events" gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE"`
	TeamID  uint  `json:"team_id" gorm:"not null"`
	Team    Team  `json:"teams" gorm:"foreignKey:TeamID;constraint:OnDelete:CASCADE"`
}
