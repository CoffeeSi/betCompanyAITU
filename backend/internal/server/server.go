package server

import (
	"github.com/CoffeeSi/betCompanyAITU/internal/handler"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
}

func NewServer(userService *service.UserService) *Server {
	router := gin.Default()

	userHandler := handler.NewUserHandler(userService)
	// router.GET("/", handler.HomeHandler)

	router.POST("/api/auth/register", userHandler.RegisterUser)
	router.POST("/api/auth/login", userHandler.LoginUser)
	router.GET("/api/auth/token/refresh", userHandler.RefreshToken)

	return &Server{
		router: router,
	}
}

func (s *Server) Run() {
	s.router.Run()
}
