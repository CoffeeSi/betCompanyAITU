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
}

func NewBetService(repository *repository.PostgresRepository, betRepo *repository.BetRepository, itemRepo *repository.BetItemRepository, outcomeRepo *repository.OutcomeRepository) *BetService {
	return &BetService{
		mainRepo:    repository,
		betRepo:     betRepo,
		itemRepo:    itemRepo,
		outcomeRepo: outcomeRepo,
	}
}

func (s *BetService) PlaceBet(ctx context.Context, data dto.BetRequest) error {
	return s.mainRepo.Transaction(func(tx *gorm.DB) error {
		//wallet error ?
		newBet := model.Bet{
			UserID: uint(data.UserID),
			Amount: data.Amount,
			Status: "pending",
		}
		if err := s.betRepo.CreateBet(ctx, tx, &newBet); err != nil {
			return err
		}
		for _, thisId := range data.OutcomeIDs {

			outcome, err := s.outcomeRepo.GetOutcomeByID(ctx, tx, uint(thisId))
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
			if err := s.itemRepo.CreateBetItems(ctx, tx, &newBetItem); err != nil {
				return err
			}
		}

		return nil

	})
}
func (s *BetService) SettleBet(ctx context.Context, betID uint, isWinner bool) error {
	return s.mainRepo.Transaction(func(tx *gorm.DB) error {
		bet, err := s.betRepo.GetBetByID(ctx, tx, uint(betID))
		if err != nil {
			return errors.New("bet not found")
		}
		if bet.Status != "pending" {
			return errors.New("bet is already settled")
		}
		bet.Status = "lost"
		if isWinner {
			bet.Status = "win"

			//payout logic
		}
		s.betRepo.UpdateBet(ctx, tx, betID, bet)
		return nil
	})
}
