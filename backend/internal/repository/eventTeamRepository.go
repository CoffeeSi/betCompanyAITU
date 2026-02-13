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

func (r *EventTeamRepository) AssignTeamsToEvent(ctx context.Context, eventID uint, teams []dto.AssignTeamRequest) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Удаляем существующие назначения команд для этого события
		if err := tx.Where("event_id = ?", eventID).Delete(&model.EventTeam{}).Error; err != nil {
			return err
		}

		// Создаем новые назначения
		for _, team := range teams {
			eventTeam := model.EventTeam{
				EventID: eventID,
				TeamID:  team.TeamID,
				Role:    team.Role,
			}
			if err := tx.Create(&eventTeam).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *EventTeamRepository) CheckEventExists(ctx context.Context, eventID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Event{}).Where("id = ?", eventID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *EventTeamRepository) CheckTeamExists(ctx context.Context, teamID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Team{}).Where("id = ?", teamID).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
