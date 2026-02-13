package handler

import (
	"net/http"

	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type EventTeamHandler struct {
	service *service.EventTeamService
}

func NewEventTeamHandler(service *service.EventTeamService) *EventTeamHandler {
	return &EventTeamHandler{service: service}
}

func (h *EventTeamHandler) GetTeamsByEvent(c *gin.Context) {
	eventID := c.Param("eventID")
	teams, err := h.service.GetTeamsByEvent(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get teams"})
		return
	}
	c.JSON(http.StatusOK, teams)
}
