package service

import (
	"errors"
	"time"

	"github.com/CoffeeSi/betCompanyAITU/internal/auth"
	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{
		repo: repo,
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
		FullName:      req.FullName,
		Email:         req.Email,
		Phone:         req.Phone,
		Dob:           &dob,
		Password:      hashedPassword,
		Role:          "user",
		EmailVerified: false,
		IsActive:      false,
	}

	return s.repo.CreateUser(&user)
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
	err = s.repo.UpdateUser(user)
	if err != nil {
		return "", err
	}

	return auth.CreateToken(user.ID)
}
