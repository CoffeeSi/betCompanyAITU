package service

import (
	"context"
	"errors"

	"github.com/CoffeeSi/betCompanyAITU/internal/auth"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

var ErrInsufficientFunds = errors.New("insufficient funds")

type WalletService struct {
	repo *repository.WalletRepository
}

func NewWalletService(repo *repository.WalletRepository) *WalletService {
	return &WalletService{
		repo: repo,
	}
}
func (s *WalletService) GetPersonalWallet(token string) (*model.Wallet, error) {
	userID, err := auth.VerifyToken(token)
	if err != nil {
		return nil, err
	}
	return s.GetWallet(userID)
}

func (s *WalletService) GetWallet(userID uint) (*model.Wallet, error) {
	return s.repo.GetByUserID(context.Background(), userID)
}

func (s *WalletService) Deposit(userID uint, amount float64) (*model.Wallet, *model.Transaction, error) {
	if amount <= 0 {
		return nil, nil, errors.New("amount must be greater than zero")
	}
	return s.repo.Deposit(context.Background(), userID, amount)
}

func (s *WalletService) Withdraw(userID uint, amount float64) (*model.Wallet, *model.Transaction, error) {
	if amount <= 0 {
		return nil, nil, errors.New("amount must be greater than zero")
	}

	wallet, txRecord, err := s.repo.Withdraw(context.Background(), userID, amount)
	if errors.Is(err, gorm.ErrInvalidData) {
		return nil, nil, ErrInsufficientFunds
	}
	return wallet, txRecord, err
}

func (s *WalletService) ListTransactions(userID uint) ([]model.Transaction, error) {
	return s.repo.ListTransactionsByUserID(context.Background(), userID)
}
