package model

import (
	"time"
)

type Event struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"not null"`
	SportID   uint      `json:"sport_id" gorm:"not null"`
	Sport     Sport     `json:"sports" gorm:"foreignKey:SportID;constraint:OnDelete:CASCADE"`
	Teams     []Team    `json:"teams" gorm:"many2many:event_teams;constraint:OnDelete:CASCADE"`
	Status    string    `json:"status" gorm:"not null;check:status IN ('scheduled', 'ongoing', 'completed')"`
	StartTime time.Time `json:"start_time" gorm:"autoCreateTime"`
	Markets   []Market  `json:"markets" gorm:"foreignKey:EventID"`
	HomeScore int       `json:"home_score" gorm:"default:0"`
	AwayScore int       `json:"away_score" gorm:"default:0"`
}
