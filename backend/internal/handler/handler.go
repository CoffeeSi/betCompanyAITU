package handler

import (
	"net/http"

	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) HomeHandler(s *gin.Context) {
	s.JSON(http.StatusOK, gin.H{"status": "ok"})
}
