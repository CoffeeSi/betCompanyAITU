// @Summary Create user
// @Description Register new user
// @Tags Users
// @Accept json
// @Produce json
// @Param user body dto.User true "User data"
// @Success 200 {object} dto.User
// @Router /users [post]

package handler

import (
	"net/http"
	"strings"

	"github.com/CoffeeSi/betCompanyAITU/internal/auth"
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
	token := c.GetHeader("Authorization")
	token = strings.TrimPrefix(token, "Bearer ")
	userID, err := auth.VerifyToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var betRequest dto.BetRequest
	if err := c.ShouldBindJSON(&betRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid bet request: " + err.Error(),
			"hint":  "Required fields: amount (number > 0), outcome_ids (array of numbers), type ('single' or 'express')",
		})
		return
	}
	//validation of id ?
	if err := h.service.PlaceBet(ctx, userID, betRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusCreated)

}

func (h *BetHandler) GetUserBets(c *gin.Context) {
	ctx := c.Request.Context()
	token := c.GetHeader("Authorization")
	token = strings.TrimPrefix(token, "Bearer ")
	userID, err := auth.VerifyToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	bets, err := h.service.GetUserBets(ctx, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, bets)
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
