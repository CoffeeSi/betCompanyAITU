package handler

import (
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type SportHandler struct {
	service *service.SportService
}

func NewSportHandler(service *service.SportService) *SportHandler {
	return &SportHandler{
		service: service,
	}
}

func (h *SportHandler) ListSports(c *gin.Context) {
	sports, err := h.service.ListSports()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, sports)
}
