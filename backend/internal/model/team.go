package model

type Team struct {
	ID      uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name    string `json:"name" gorm:"not null"`
	LogoUrl string `json:"logo_url" gorm:"not null"`
	SportID uint   `json:"sport_id" gorm:"not null"`
	Sport   Sport  `json:"sports" gorm:"foreignKey:SportID;constraint:OnDelete:CASCADE"`
}
