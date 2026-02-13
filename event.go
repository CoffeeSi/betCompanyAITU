package dto

import (
	"time"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
)

type EventsResponse struct {
	Events     []model.Event `json:"events"`
	Page       int           `json:"page"`
	PageSize   int           `json:"page_size"`
	TotalItems int64         `json:"total_items"`
	TotalPages int           `json:"total_pages"`
}
type OutcomeDTO struct {
	Selection string  `json:"selection"`
	Odds      float64 `json:"odds"`
}

type CreateEventRequest struct {
	SportID    uint                    `json:"sport_id"`
	HomeTeamID uint                    `json:"home_team_id"`
	AwayTeamID uint                    `json:"away_team_id"`
	StartTime  time.Time               `json:"start_time"`
	Markets    map[string][]OutcomeDTO `json:"markets"`
}
