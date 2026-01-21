package server

import (
	"github.com/CoffeeSi/betCompanyAITU/internal/handler"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
}

func NewServer(service *service.Service) *Server {
	router := gin.Default()

	handler := handler.NewHandler(service)
	router.GET("/", handler.HomeHandler)

	return &Server{
		router: router,
	}
}

func (s *Server) Run() {
	s.router.Run()
}
