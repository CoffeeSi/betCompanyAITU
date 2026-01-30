package model

import (
	"gorm.io/gorm"
)

type Sport struct {
	gorm.Model
	Name string `json:"name" gorm:"not null"`
}
