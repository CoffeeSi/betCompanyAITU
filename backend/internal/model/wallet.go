package model

type Wallet struct {
	ID      uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Balance float64 `json:"balance" gorm:"not null;default:0"`
	UserID  uint    `json:"user_id" gorm:"not null"`
	User    User    `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}
