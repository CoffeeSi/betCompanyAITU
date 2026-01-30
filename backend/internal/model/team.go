package model

import "gorm.io/gorm"

type Team struct {
	gorm.Model
	Name    string `json:"name" gorm:"not null"`
	LogoUrl string `json:"logo_url" gorm:"not null"`
	SportID string `json:"sport_id" gorm:"not null"`
	Sport   Sport  `json:"sports" gorm:"foreignKey:SportID;constraint:OnDelete:CASCADE"`
}
