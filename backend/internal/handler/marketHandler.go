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

	"github.com/CoffeeSi/betCompanyAITU/internal/model"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type MarketHandler struct {
	service *service.MarketService
}

func NewMarketHandler(s *service.MarketService) *MarketHandler {
	return &MarketHandler{service: s}
}

func (h *MarketHandler) ListMarkets(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	result, err := h.service.ListMarkets(c.Request.Context(), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *MarketHandler) GetMarket(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid market id"})
		return
	}

	market, err := h.service.GetMarketByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "market not found"})
		return
	}

	c.JSON(http.StatusOK, market)
}

type createMarketRequest struct {
	EventID    uint   `json:"event_id" binding:"required"`
	MarketType string `json:"market_type" binding:"required"`
	Status     string `json:"status"`
}

func (h *MarketHandler) CreateMarket(c *gin.Context) {
	var req createMarketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	market := &model.Market{
		EventID:    req.EventID,
		MarketType: req.MarketType,
		Status:     req.Status,
	}
	if market.Status == "" {
		market.Status = "active"
	}

	if err := h.service.CreateMarket(c.Request.Context(), market); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, market)
}

type updateMarketRequest struct {
	EventID    uint   `json:"event_id"`
	MarketType string `json:"market_type"`
	Status     string `json:"status"`
}

func (h *MarketHandler) UpdateMarket(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid market id"})
		return
	}

	var req updateMarketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	market := &model.Market{
		EventID:    req.EventID,
		MarketType: req.MarketType,
		Status:     req.Status,
	}

	if err := h.service.UpdateMarket(c.Request.Context(), uint(id), market); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "market updated"})
}

func (h *MarketHandler) DeleteMarket(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid market id"})
		return
	}

	if err := h.service.DeleteMarket(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
