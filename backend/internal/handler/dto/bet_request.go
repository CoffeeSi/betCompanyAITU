package dto

type BetRequest struct {
	Amount     float64 `json:"amount" binding:"required,gt=0"`
	OutcomeIDs []uint  `json:"outcome_ids" binding:"required,min=1"`

	Type string `json:"type" binding:"required,oneof=single express"`
}
