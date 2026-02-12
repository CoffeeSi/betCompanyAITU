package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type TeamRepository struct {
	db *gorm.DB
}

func NewTeamRepository(db *gorm.DB) *TeamRepository {
	return &TeamRepository{db: db}
}

func (r *TeamRepository) ListTeams(ctx context.Context, page, pageSize int) ([]*model.Team, int64, error) {
	var teams []*model.Team
	var total int64

	err := r.db.WithContext(ctx).Model(&model.Team{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize

	err = r.db.WithContext(ctx).Offset(offset).Limit(pageSize).Find(&teams).Error
	if err != nil {
		return nil, 0, err
	}
	return teams, total, nil
}

func (r *TeamRepository) ListTeamsBySport(ctx context.Context, sportID uint, page, pageSize int) ([]*model.Team, int64, error) {
	var teams []*model.Team
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Team{}).Where("sport_id = ?", sportID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize

	err := query.Offset(offset).Limit(pageSize).Find(&teams).Error
	if err != nil {
		return nil, 0, err
	}
	return teams, total, nil
}

func (r *TeamRepository) GetTeamByID(ctx context.Context, teamID uint) (*model.Team, error) {
	var team model.Team
	err := r.db.WithContext(ctx).Model(&model.Team{}).Preload("Sport").Where("id = ?", teamID).First(&team).Error
	if err != nil {
		return nil, err
	}
	return &team, nil
}

func (r *TeamRepository) CreateTeam(ctx context.Context, team *model.Team) error {
	return r.db.WithContext(ctx).Create(team).Error
}

func (r *TeamRepository) UpdateTeam(ctx context.Context, team *model.Team) error {
	return r.db.WithContext(ctx).Save(team).Error
}

func (r *TeamRepository) DeleteTeam(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&model.Team{}, id).Error
}
