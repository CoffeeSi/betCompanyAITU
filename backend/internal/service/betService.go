package service

import (
	"context"
	"errors"
	"fmt"
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
	eventRepo   *repository.EventRepository
}

func NewBetService(repository *repository.PostgresRepository, betRepo *repository.BetRepository, itemRepo *repository.BetItemRepository, outcomeRepo *repository.OutcomeRepository, walletRepo *repository.WalletRepository, eventRepo *repository.EventRepository) *BetService {
	return &BetService{
		mainRepo:    repository,
		betRepo:     betRepo,
		itemRepo:    itemRepo,
		outcomeRepo: outcomeRepo,
		walletRepo:  walletRepo,
		eventRepo:   eventRepo,
	}
}

func (s *BetService) GetUserBets(ctx context.Context, userID uint) ([]model.Bet, error) {
	return s.betRepo.ListBetsByUserID(ctx, userID)
}

func (s *BetService) PlaceBet(ctx context.Context, userID uint, dto dto.BetRequest) error {
	return s.mainRepo.Transaction(ctx, func(tx *gorm.DB) error {

		wallet, err := s.walletRepo.GetByUserID(ctx, tx, userID)
		if err != nil {
			return errors.New("wallet not found")
		}
		if wallet.Balance < dto.Amount {
			return errors.New("insufficient balance: you need at least ₸" + formatAmount(dto.Amount) + " but have ₸" + formatAmount(wallet.Balance))
		}

		if dto.Type == "express" && len(dto.OutcomeIDs) < 2 {
			return errors.New("express bets require at least 2 outcomes")
		}

		eventSet := make(map[uint]bool)
		for _, outcomeID := range dto.OutcomeIDs {
			outcome, err := s.outcomeRepo.GetOutcomeByID(ctx, tx, outcomeID)
			if err != nil {
				return errors.New("outcome not found")
			}
			market, err := s.outcomeRepo.GetMarketByOutcomeID(ctx, tx, outcome.ID)
			if err != nil {
				return errors.New("market not found for outcome")
			}

			if market.Status != "active" {
				return errors.New("cannot place bet on closed market")
			}

			event, err := s.eventRepo.GetEventByID(ctx, market.EventID)
			if err != nil {
				return errors.New("event not found")
			}
			if event.Status == "completed" {
				return errors.New("cannot place bet on completed event")
			}
			if event.Status == "scheduled" {
				return errors.New("cannot place bet on event that hasn't started")
			}

			if dto.Type == "express" {
				if eventSet[market.EventID] {
					return errors.New("express bets cannot contain multiple outcomes from the same event")
				}
				eventSet[market.EventID] = true
			}
		}

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
		affectedMarkets := make(map[uint]struct{})

		for _, outcomeID := range dto.OutcomeIDs {
			outcome, err := s.outcomeRepo.GetOutcomeByID(ctx, tx, outcomeID)
			if err != nil {
				return errors.New("outcome not found")
			}

			item := &model.BetItem{
				BetID:     bet.ID,
				OutcomeID: outcome.ID,
				Odds:      outcome.Odds,
				Amount:    dto.Amount,
			}

			if err := s.itemRepo.CreateBetItems(ctx, tx, item); err != nil {
				return err
			}

			totalOdds *= outcome.Odds
			affectedMarkets[outcome.MarketID] = struct{}{}
		}
		bet.TotalOdd = totalOdds

		if err := s.betRepo.UpdateBet(ctx, tx, bet.ID, bet); err != nil {
			return err
		}

		for marketID := range affectedMarkets {
			if err := s.recalculateMarketOdds(ctx, tx, marketID); err != nil {
				return err
			}
		}

		return nil
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

func (s *BetService) recalculateMarketOdds(ctx context.Context, tx *gorm.DB, marketID uint) error {
	outcomes, err := s.outcomeRepo.GetByMarketIDTx(ctx, tx, marketID)
	if err != nil {
		return err
	}
	if len(outcomes) == 0 {
		return nil
	}

	outcomeIDs := make([]uint, 0, len(outcomes))
	for _, outcome := range outcomes {
		outcomeIDs = append(outcomeIDs, outcome.ID)
	}

	stakesByOutcome, err := s.itemRepo.GetPendingStakeByOutcomeIDs(ctx, tx, outcomeIDs)
	if err != nil {
		return err
	}

	var totalStake float64
	for _, outcomeID := range outcomeIDs {
		totalStake += stakesByOutcome[outcomeID]
	}
	if totalStake <= 0 {
		return nil
	}

	const (
		epsilon = 0.01
		margin  = 0.95
		minOdds = 1.01
		maxOdds = 50.0
	)

	outcomesCount := float64(len(outcomes))
	denominator := totalStake + epsilon*outcomesCount

	for _, outcome := range outcomes {
		stake := stakesByOutcome[outcome.ID]
		share := (stake + epsilon) / denominator
		newOdds := margin / share
		if newOdds < minOdds {
			newOdds = minOdds
		}
		if newOdds > maxOdds {
			newOdds = maxOdds
		}
		newOdds = math.Round(newOdds*100) / 100

		if err := s.outcomeRepo.UpdateOutcomeOddsTx(ctx, tx, outcome.ID, newOdds); err != nil {
			return err
		}
	}

	return nil
}

// formatAmount formats a float amount to a string with 2 decimal places
func formatAmount(amount float64) string {
	return fmt.Sprintf("%.2f", amount)
}
