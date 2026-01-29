package handler

import (
	"net/http"

	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/backend/internal/database"
)

type Handler struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{
		service: service,
	}
}

func CreateBet(c *gin.Context) {
	var bet models.Bet
	if err := c.ShouldBindJSON(&bet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Create(&bet)
	c.JSON(http.StatusCreated, bet)
}

// READ ALL
func GetBets(c *gin.Context) {
	var bets []models.Bet
	database.DB.Find(&bets)
	c.JSON(http.StatusOK, bets)
}

// READ ONE
func GetBet(c *gin.Context) {
	id := c.Param("id")
	var bet models.Bet

	if err := database.DB.First(&bet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bet not found"})
		return
	}

	c.JSON(http.StatusOK, bet)
}

// UPDATE
func UpdateBet(c *gin.Context) {
	id := c.Param("id")
	var bet models.Bet

	if err := database.DB.First(&bet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bet not found"})
		return
	}

	if err := c.ShouldBindJSON(&bet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&bet)
	c.JSON(http.StatusOK, bet)
}

// DELETE
func DeleteBet(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Bet{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Bet deleted"})
}

func (h *Handler) HomeHandler(s *gin.Context) {
	s.JSON(http.StatusOK, gin.H{"status": "ok"})
}
