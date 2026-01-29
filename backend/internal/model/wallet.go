package model

import "gorm.io/gorm"

type Wallet struct {
	gorm.Model
	Balance float64 `json:"balance" gorm:"not null;default:0"`
	UserID  uint    `json:"user_id" gorm:"not null"`
	User    User    `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}
