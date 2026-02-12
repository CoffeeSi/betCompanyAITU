package service

import (
	"context"
	"errors"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"gorm.io/gorm"
)

type BetService struct {
	mainRepo    *repository.PostgresRepository
	betRepo     *repository.BetRepository
	itemRepo    *repository.BetItemRepository
	outcomeRepo *repository.OutcomeRepository
	walletRepo  *repository.WalletRepository
}

func NewBetService(repository *repository.PostgresRepository, betRepo *repository.BetRepository, itemRepo *repository.BetItemRepository, outcomeRepo *repository.OutcomeRepository, walletRepo *repository.WalletRepository) *BetService {
	return &BetService{
		mainRepo:    repository,
		betRepo:     betRepo,
		itemRepo:    itemRepo,
		outcomeRepo: outcomeRepo,
		walletRepo:  walletRepo,
	}
}
func (s *BetService) PlaceBet(ctx context.Context, userID uint, dto dto.BetRequest) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {

		if _, _, err := s.walletRepo.Withdraw(ctx, tx, userID, dto.Amount); err != nil {
			return err
		}

		bet := &model.Bet{
			UserID:   userID,
			Amount:   dto.Amount,
			Status:   "pending",
			Type:     dto.Type,
			TotalOdd: 1.0,
		}

		if err := s.betRepo.CreateBet(ctx, tx, bet); err != nil {
			return err
		}

		var totalOdds float64 = 1.0

		for _, outcomeID := range dto.OutcomeIDs {
			outcome, err := s.outcomeRepo.GetOutcomeByID(ctx, tx, outcomeID)
			if err != nil {
				return errors.New("outcome not found")
			}

			item := &model.BetItem{
				BetID:     bet.ID,
				OutcomeID: outcome.ID,
				Odds:      outcome.Odds,
			}

			if err := s.itemRepo.CreateBetItems(ctx, tx, item); err != nil {
				return err
			}

			totalOdds *= outcome.Odds
		}
		bet.TotalOdd = totalOdds
		return s.betRepo.UpdateBet(ctx, tx, bet.ID, bet)
	})
}

func (s *BetService) SettleBet(ctx context.Context, betID uint, isWinner bool) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {
		bet, err := s.betRepo.GetBetByID(ctx, tx, betID)
		if err != nil {
			return err
		}

		if bet.Status != "pending" {
			return errors.New("bet already settled")
		}

		if isWinner {
			bet.Status = "win"
			winAmount := bet.Amount * bet.TotalOdd
			if _, _, err := s.walletRepo.Win(ctx, tx, bet.UserID, winAmount); err != nil {
				return err
			}
		} else {
			bet.Status = "lost"
		}

		return s.betRepo.UpdateBet(ctx, tx, betID, bet)
	})
}
