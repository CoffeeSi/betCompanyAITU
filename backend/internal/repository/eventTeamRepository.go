package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"

	"gorm.io/gorm"
)

type EventTeamRepository struct {
	db *gorm.DB
}

func NewEventTeamRepository(db *gorm.DB) *EventTeamRepository {
	return &EventTeamRepository{db: db}
}

func (r *EventTeamRepository) GetTeamsByEvent(ctx context.Context, eventID string) (dto.EventTeamResponse, error) {
	var teamIDs []int8
	err := r.db.WithContext(ctx).Model(&model.EventTeam{}).Where("event_id = ?", eventID).Pluck("team_id", &teamIDs).Error
	if err != nil {
		return dto.EventTeamResponse{}, err
	}
	return dto.EventTeamResponse{TeamIDs: teamIDs}, nil
}
