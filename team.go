package dto

import "github.com/CoffeeSi/betCompanyAITU/internal/model"

type TeamResponse struct {
	Team *model.Team `json:"team"`
}

type TeamsResponse struct {
	Teams      []*model.Team `json:"teams"`
	Page       int           `json:"page"`
	PageSize   int           `json:"page_size"`
	TotalItems int64         `json:"total_items"`
	TotalPages int           `json:"total_pages"`
}

type CreateTeamRequest struct {
	Name    string `json:"name" binding:"required"`
	LogoURL string `json:"logo_url" binding:"required"`
	SportID uint   `json:"sport_id" binding:"required,gt=0"`
}

type UpdateTeamRequest struct {
	Name    string `json:"name" binding:"required"`
	LogoURL string `json:"logo_url" binding:"required"`
	SportID uint   `json:"sport_id" binding:"required,gt=0"`
}
