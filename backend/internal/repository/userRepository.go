package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (ur *UserRepository) GetUsers(ctx context.Context) ([]model.User, error) {
	var users []model.User

	result := ur.db.WithContext(ctx).Find(&users)
	if result.Error != nil {
		return users, nil
	}
	return users, result.Error
}

func (ur *UserRepository) CreateUser(ctx context.Context, user *model.User) error {
	result := ur.db.WithContext(ctx).Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (ur *UserRepository) DeleteUser(ctx context.Context, id uint) error {

	result := ur.db.WithContext(ctx).Delete(model.User{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (ur *UserRepository) UpdateUser(ctx context.Context, id uint, newUser *model.User) error {

	result := ur.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Updates(newUser)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
