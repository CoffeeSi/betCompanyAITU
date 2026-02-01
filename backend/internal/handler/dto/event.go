package dto

import "github.com/CoffeeSi/betCompanyAITU/internal/model"

type EventsResponse struct {
	Events     []model.Event `json:"events"`
	Page       int           `json:"page"`
	PageSize   int           `json:"page_size"`
	TotalItems int64         `json:"total_items"`
	TotalPages int           `json:"total_pages"`
}
