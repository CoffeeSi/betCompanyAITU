package model

import (
	"time"
)

type User struct {
	ID        uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	FullName  string     `json:"full_name" gorm:"not null;size:100"`
	Email     string     `json:"email" gorm:"unique;not null;size:100"`
	Phone     string     `json:"phone" gorm:"unique;not null;size:15"`
	Dob       *time.Time `json:"dob" gorm:"not null"`
	Password  string     `json:"-" gorm:"not null"`
	Role      string     `json:"role" gorm:"not null;default:'user';check:role IN ('user', 'admin')"`
	LastLogin *time.Time `json:"last_login" gorm:"default:null"`
	IsActive  bool       `json:"is_active" gorm:"not null;default:true"`
	CreatedAt time.Time  `json:"start_time" gorm:"autoCreateTime"`
}
