package dto

type FinishEventRequest struct {
	HomeScore int `json:"home_score"`
	AwayScore int `json:"away_score"`
}
