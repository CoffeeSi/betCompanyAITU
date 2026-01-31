package dto

type SettleBetRequest struct {
	BetID    uint `json:"bet_id" binding:"required"`
	IsWinner bool `json:"is_winner"`