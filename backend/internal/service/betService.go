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
	repo *repository.Repositories
}

func NewBetService(Repositories *repository.Repositories) *BetService {
	return &BetService{
		repo: Repositories,
	}
}

func (s *BetService) PlaceBet(ctx context.Context, data dto.BetRequest) error {
	return s.repo.Postgre.Transaction(func(tx *gorm.DB) error {
		usersWallet, err := s.repo.Wallet.GetByUserID(ctx, uint(data.UserID))
		if err != nil {

			return err

		}
		_, _, err = s.repo.Wallet.Withdraw(ctx, usersWallet.UserID, data.Amount)
		if err != nil {
			return err
		}
		newBet := model.Bet{
			UserID: uint(data.UserID),
			Amount: data.Amount,
			Status: "pending",
		}
		if err := s.repo.Bet.CreateBet(ctx, tx, &newBet); err != nil {
			return err
		}

		for _, thisId := range data.OutcomeIDs {

			outcome, err := s.repo.Outcome.GetOutcomeByID(ctx, tx, uint(thisId))
			if err != nil {
				return errors.New("outcome not found")
			}
			if outcome.Result != "active" {
				return errors.New("match ended")
			}
			newBetItem := model.BetItem{

				BetID:     newBet.ID,
				OutcomeID: uint(thisId),
				Odds:      outcome.Odds,
			}
			if err := s.repo.BetItem.CreateBetItems(ctx, tx, &newBetItem); err != nil {
				return err
			}
		}

		return nil

	})
}
func (s *BetService) SettleBet(ctx context.Context, betID uint, isWinner bool) error {
	return s.repo.Postgre.Transaction(func(tx *gorm.DB) error {
		bet, err := s.repo.Bet.GetBetByID(ctx, tx, uint(betID))
		if err != nil {
			return errors.New("bet not found")
		}
		if bet.Status != "pending" {
			return errors.New("bet is already settled")
		}
		bet.Status = "lost"
		betItems, _ := s.repo.BetItem.GetBetItemsByBetID(bet.ID)

		if isWinner {
			bet.Status = "win"
			s.repo.Wallet.Deposit(ctx, bet.UserID, bet.Amount*betItems.Odds)
		}
		s.repo.Bet.UpdateBet(ctx, tx, betID, bet)
		return nil
	})
}
