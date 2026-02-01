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

func (r *TeamRepository) ListTeamsBySport(ctx context.Context, sportID string, page, pageSize int) ([]*model.Team, int64, error) {
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
