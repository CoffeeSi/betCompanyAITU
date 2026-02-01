package model

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Name      string    `json:"name" gorm:"not null"`
	SportID   uint      `json:"sport_id" gorm:"not null"`
	Sport     Sport     `json:"sports" gorm:"foreignKey:SportID;constraint:OnDelete:CASCADE"`
	Status    string    `json:"status" gorm:"not null;check:status IN ('scheduled', 'ongoing', 'completed')"`
	StartTime time.Time `json:"start_time" gorm:"autoCreateTime"`
}
