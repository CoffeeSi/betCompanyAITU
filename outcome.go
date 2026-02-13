package dto

type UpdateOutcomeOddsRequest struct {
	Odds float64 `json:"odds" binding:"required,gt=0"`
}
