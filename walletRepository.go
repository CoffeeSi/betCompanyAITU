package repository

import (
	"context"

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type WalletRepository struct {
	db *gorm.DB
}

func NewWalletRepository(db *gorm.DB) *WalletRepository {
	return &WalletRepository{
		db: db,
	}
}

func (r *WalletRepository) CreateForUser(ctx context.Context, tx *gorm.DB, userID uint) (*model.Wallet, error) {
	wallet := model.Wallet{
		UserID:  userID,
		Balance: 0,
	}

	db := r.db
	if tx != nil {
		db = tx
	}

	if err := db.WithContext(ctx).Create(&wallet).Error; err != nil {
		return nil, err
	}

	return &wallet, nil
}

func (r *WalletRepository) GetByUserID(ctx context.Context, tx *gorm.DB, userID uint) (*model.Wallet, error) {
	var wallet model.Wallet
	db := r.db
	if tx != nil {
		db = tx
	}

	if err := db.WithContext(ctx).Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		return nil, err
	}

	return &wallet, nil
}

func (r *WalletRepository) Deposit(ctx context.Context, tx *gorm.DB, userID uint, amount float64) (*model.Wallet, *model.Transaction, error) {
	var wallet model.Wallet
	var txRecord model.Transaction

	db := r.db
	if tx != nil {
		db = tx
	}

	err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("user_id = ?", userID).
			First(&wallet).Error; err != nil {
			return err
		}

		wallet.Balance += amount
		if err := tx.Save(&wallet).Error; err != nil {
			return err
		}

		txRecord = model.Transaction{
			WalletID: wallet.ID,
			Type:     "deposit",
			Amount:   amount,
			Status:   "completed",
		}

		if err := tx.Create(&txRecord).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, nil, err
	}

	return &wallet, &txRecord, nil
}

func (r *WalletRepository) Withdraw(ctx context.Context, tx *gorm.DB, userID uint, amount float64) (*model.Wallet, *model.Transaction, error) {
	var wallet model.Wallet
	var txRecord model.Transaction

	db := r.db
	if tx != nil {
		db = tx
	}

	err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("user_id = ?", userID).
			First(&wallet).Error; err != nil {
			return err
		}

		if wallet.Balance < amount {
			return gorm.ErrInvalidData
		}

		wallet.Balance -= amount
		if err := tx.Save(&wallet).Error; err != nil {
			return err
		}

		txRecord = model.Transaction{
			WalletID: wallet.ID,
			Type:     "withdrawal",
			Amount:   amount,
			Status:   "completed",
		}

		if err := tx.Create(&txRecord).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, nil, err
	}

	return &wallet, &txRecord, nil
}

func (r *WalletRepository) Win(ctx context.Context, tx *gorm.DB, userID uint, amount float64) (*model.Wallet, *model.Transaction, error) {
	var wallet model.Wallet
	var txRecord model.Transaction

	db := r.db
	if tx != nil {
		db = tx
	}

	err := db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("user_id = ?", userID).
			First(&wallet).Error; err != nil {
			return err
		}

		wallet.Balance += amount
		if err := tx.Save(&wallet).Error; err != nil {
			return err
		}

		txRecord = model.Transaction{
			WalletID: wallet.ID,
			Type:     "win",
			Amount:   amount,
			Status:   "completed",
		}

		if err := tx.Create(&txRecord).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, nil, err
	}

	return &wallet, &txRecord, nil
}

func (r *WalletRepository) ListTransactionsByUserID(ctx context.Context, tx *gorm.DB, userID uint) ([]model.Transaction, error) {
	var transactions []model.Transaction

	db := r.db
	if tx != nil {
		db = tx
	}

	err := db.WithContext(ctx).
		Joins("JOIN wallets ON wallets.id = transactions.wallet_id").
		Where("wallets.user_id = ?", userID).
		Order("transactions.created_at DESC").
		Find(&transactions).Error
	if err != nil {
		return nil, err
	}

	return transactions, nil
}

func (r *WalletRepository) LockWalletByUserId(tx *gorm.DB, userId uint) (*WalletRepository, error) {
	var wallet WalletRepository
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", userId).First(&wallet.db.Error).Error
	if err != nil {
		return nil, err
	}
	return &wallet, nil

}
