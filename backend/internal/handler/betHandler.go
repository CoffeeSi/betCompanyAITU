package handler

import (
	"net/http"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type BetHandler struct {
	service *service.BetService
}

func NewBetHandler(service *service.BetService) *BetHandler {

	return &BetHandler{
		service: service,
	}

}

func (h *BetHandler) CreateBet(c *gin.Context) {
	ctx := c.Request.Context()
	var betRequest dto.BetRequest
	if err := c.ShouldBindJSON(&betRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//validation of id ?
	if err := h.service.PlaceBet(ctx, betRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusCreated)

}

func (h *BetHandler) SettleBet(c *gin.Context) {
	ctx := c.Request.Context()
	var betSettleRequest dto.SettleBetRequest
	if err := c.ShouldBindJSON(&betSettleRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.SettleBet(ctx, betSettleRequest.BetID, betSettleRequest.IsWinner); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return

	}

	c.Status(http.StatusOK)
}
