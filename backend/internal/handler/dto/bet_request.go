package dto

type BetRequest struct {
	UserID     int     `json:"-"`
	Amount     float64 `json:"amount" binding:"required,gt=0"`
	OutcomeIDs []int   `json:"outcome_ids" binding:"required,min=1"`
}
