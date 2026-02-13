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
	"strconv"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler/dto"
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

func (h *EventTeamHandler) AssignTeamsToEvent(c *gin.Context) {
	// Получаем ID события из URL параметра
	eventIDStr := c.Param("id")
	eventID, err := strconv.ParseUint(eventIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event id"})
		return
	}

	// Парсим тело запроса
	var req dto.AssignTeamsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Вызываем сервис
	if err := h.service.AssignTeamsToEvent(uint(eventID), req.Teams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "teams assigned successfully"})
}
