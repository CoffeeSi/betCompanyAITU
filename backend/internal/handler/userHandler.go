package handler

import (
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

func (h *UserHandler) RegisterUser(c *gin.Context) {

}

func (h *UserHandler) LoginUser(c *gin.Context) {

}
