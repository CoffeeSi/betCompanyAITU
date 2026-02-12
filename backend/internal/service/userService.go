package service

import (
	"context"
	"errors"
	"time"

	"github.com/CoffeeSi/betCompanyAITU/internal/auth"
	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type UserService struct {
	repo       *repository.UserRepository
	walletRepo *repository.WalletRepository
}

func NewUserService(repo *repository.UserRepository, walletRepo *repository.WalletRepository) *UserService {
	return &UserService{
		repo:       repo,
		walletRepo: walletRepo,
	}
}

func (s *UserService) RegisterUser(req dto.RegisterRequest) error {
	dob, err := time.Parse("2006-01-02", req.Dob)
	if err != nil {
		return err
	}

	if len(req.Password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	if req.Password != req.ConfirmPassword {
		return errors.New("passwords do not match")
	}

	hashedPassword, err := auth.HashPassword(req.Password)
	if err != nil {
		return err
	}

	user := model.User{
		FullName: req.FullName,
		Email:    req.Email,
		Phone:    req.Phone,
		Dob:      &dob,
		Password: hashedPassword,
		Role:     "user",
		IsActive: false,
	}

	if err := s.repo.CreateUser(context.Background(), &user); err != nil {
		return err
	}

	_, err = s.walletRepo.CreateForUser(context.Background(), nil, user.ID)
	return err
}

func (s *UserService) LoginUser(req dto.LoginRequest) (string, error) {
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return "", err
	}

	if !auth.CheckPasswordHash(user.Password, req.Password) {
		return "", errors.New("invalid password")
	}
	lastLogin := time.Now()
	user.LastLogin = &lastLogin
	err = s.repo.UpdateUser(context.Background(), user.ID, user)
	if err != nil {
		return "", err
	}

	return auth.CreateToken(user.ID)
}

func (s *UserService) RefreshToken(refreshToken string) (string, error) {
	userID, err := auth.VerifyToken(refreshToken)
	if err != nil {
		return "", err
	}

	newAccessToken, err := auth.CreateToken(userID)
	if err != nil {
		return "", err
	}

	return newAccessToken, nil
}

func (s *UserService) GetProfile(refreshToken string) (*model.User, error) {
	userID, err := auth.VerifyToken(refreshToken)
	if err != nil {
		return nil, err
	}
	profile, err := s.repo.GetProfileByUserID(context.Background(), userID)
	if err != nil {
		return nil, err
	}

	return profile, nil
}
