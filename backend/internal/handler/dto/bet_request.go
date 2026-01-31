package dto

type BetRequest struct {
	OutcomeIDs []int   `json:"outcome_ids" binding:"required,min=1"`
	Amount     float64 `json:"amount" binding:"required,gt=0"`
}
