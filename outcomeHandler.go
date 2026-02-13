package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OutcomeHandler struct {
	service *service.OutcomeService
}

func NewOutcomeHandler(service *service.OutcomeService) *OutcomeHandler {
	return &OutcomeHandler{service: service}
}

func (h *OutcomeHandler) UpdateOdds(c *gin.Context) {
	rawID := c.Param("id")
	id, err := strconv.ParseUint(rawID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid outcome id"})
		return
	}

	var req dto.UpdateOutcomeOddsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateOdds(uint(id), req.Odds); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "outcome not found"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
