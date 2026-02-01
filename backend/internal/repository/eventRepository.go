package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type EventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) *EventRepository {
	return &EventRepository{
		db: db,
	}
}

func (r *EventRepository) ListEvents(ctx context.Context, page, pageSize int) ([]model.Event, int64, error) {
	var events []model.Event

	query := r.db.WithContext(ctx).Model(&model.Event{})

	var total int64
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize

	err = query.Preload("Sport").Preload("Teams").Preload("Teams.Sport").Offset(offset).Limit(pageSize).Find(&events).Error
	if err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

func (r *EventRepository) ListEventsBySport(ctx context.Context, sportID uint, page, pageSize int) ([]model.Event, int64, error) {
	var events []model.Event
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Event{}).Where("sport_id = ?", sportID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize

	err := query.Preload("Sport").Preload("Teams").Preload("Teams.Sport").Offset(offset).Limit(pageSize).Find(&events).Error
	if err != nil {
		return nil, 0, err
	}
	return events, total, nil
}

func (r *EventRepository) ListEventsByTeam(ctx context.Context, teamID uint, page, pageSize int) ([]model.Event, int64, error) {
	var events []model.Event
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Event{}).
		Joins("JOIN event_teams ON event_teams.event_id = events.id").
		Where("event_teams.team_id = ?", teamID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize

	err := query.Preload("Sport").Preload("Teams").Preload("Teams.Sport").Offset(offset).Limit(pageSize).Find(&events).Error
	if err != nil {
		return nil, 0, err
	}
	return events, total, nil
}

func (r *EventRepository) GetEventByID(ctx context.Context, id uint) (*model.Event, error) {
	var event model.Event
	err := r.db.WithContext(ctx).Preload("Sport").Preload("Teams").Preload("Teams.Sport").First(&event, id).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *EventRepository) CreateEvent(ctx context.Context, event *model.Event) error {
	return r.db.WithContext(ctx).Create(event).Error
}

func (r *EventRepository) UpdateEvent(ctx context.Context, event *model.Event) error {
	return r.db.WithContext(ctx).Save(event).Error
}

func (r *EventRepository) DeleteEvent(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&model.Event{}, id).Error
}
