package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FullName  string    `json:"full_name" gorm:"not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Phone     string    `json:"phone" gorm:"unique;not null"`
	Dob       time.Time `json:"dob" gorm:"not null"`
	Password  string    `json:"password" gorm:"not null"`
	Role      string    `json:"role" gorm:"not null;default:'user';check:role IN ('user', 'admin')"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}
