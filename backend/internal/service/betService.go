package service

import (
	"context"
	"errors"
	"math"

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

func (s *BetService) checkAndFinalizeBet(ctx context.Context, tx *gorm.DB, betID uint) error {
	var bet model.Bet

	err := tx.Preload("Items.Outcome").First(&bet, betID).Error
	if err != nil {
		return err
	}

	if bet.Status != "pending" {
		return nil
	}

	allWon := true
	anyLost := false

	for _, item := range bet.Items {
		switch item.Outcome.Result {
		case "lost":
			anyLost = true
		case "pending":
			allWon = false
		case "won":
		}

		if anyLost {
			break
		}
	}

	if anyLost {
		return tx.Model(&bet).Update("status", "lost").Error
	}

	if allWon {
		winAmount := bet.Amount * bet.TotalOdd
		if _, _, err := s.walletRepo.Win(ctx, tx, bet.UserID, winAmount); err != nil {
			return err
		}
		return tx.Model(&bet).Update("status", "won").Error
	}

	return nil
}

func (s *BetService) SettleBetsByEvent(ctx context.Context, tx *gorm.DB, eventID uint) error {

	var bets []model.Bet

	err := tx.
		Joins("JOIN bet_items ON bet_items.bet_id = bets.id").
		Joins("JOIN outcomes ON outcomes.id = bet_items.outcome_id").
		Joins("JOIN markets ON markets.id = outcomes.market_id").
		Where("markets.event_id = ? AND bets.status = ?", eventID, "pending").
		Preload("Items.Outcome").
		Find(&bets).Error

	if err != nil {
		return err
	}

	for _, bet := range bets {

		allWon := true
		anyLost := false

		for _, item := range bet.Items {
			switch item.Outcome.Result {
			case "lost":
				anyLost = true
			case "pending":
				allWon = false
			}
			if anyLost {
				break
			}
		}

		if anyLost {
			if err := tx.Model(&bet).Update("status", "lost").Error; err != nil {
				return err
			}
			continue
		}

		if allWon {
			winAmount := math.Round(bet.Amount*bet.TotalOdd*100) / 100

			if _, _, err := s.walletRepo.Win(ctx, tx, bet.UserID, winAmount); err != nil {
				return err
			}

			if err := tx.Model(&bet).Update("status", "win").Error; err != nil {
				return err
			}
		}
	}

	return nil
}
