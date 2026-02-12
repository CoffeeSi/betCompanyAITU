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

func (r *UserRepository) ListUsers(ctx context.Context) ([]model.User, error) {
	var users []model.User
	err := r.db.WithContext(ctx).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, user *model.User) error {
	result := r.db.WithContext(ctx).Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *UserRepository) GetProfileByUserID(context context.Context, userID uint) (*model.User, error) {
	var user model.User
	err := r.db.WithContext(context).First(&user, userID).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

//	func (r *UserRepository) UpdateUser(user *model.User) error {
//		err := r.db.Save(user).Error
//		if err != nil {
//			return err
//		}
func (r *UserRepository) DeleteUser(ctx context.Context, id uint) error {

	result := r.db.WithContext(ctx).Delete(model.User{}, id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *UserRepository) UpdateUser(ctx context.Context, id uint, newUser *model.User) error {

	result := r.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Updates(newUser)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
