package server

import (
	"time"

	"github.com/CoffeeSi/betCompanyAITU/internal/handler"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
}

func NewServer(userService *service.UserService, walletService *service.WalletService, sportService *service.SportService) *Server {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	userHandler := handler.NewUserHandler(userService)
	walletHandler := handler.NewWalletHandler(walletService)
	// router.GET("/", handler.HomeHandler)

	router.POST("/api/auth/register", userHandler.RegisterUser)
	router.POST("/api/auth/login", userHandler.LoginUser)
	router.GET("/api/auth/token/refresh", userHandler.RefreshToken)

	router.GET("/api/wallet/:userId", walletHandler.GetWallet)
	router.POST("/api/wallet/:userId/deposit", walletHandler.Deposit)
	router.POST("/api/wallet/:userId/withdraw", walletHandler.Withdraw)
	router.GET("/api/wallet/:userId/transactions", walletHandler.ListTransactions)

	sportHandler := handler.NewSportHandler(sportService)
	router.GET("/api/sports", sportHandler.ListSports)

	return &Server{
		router: router,
	}
}

func (s *Server) Run() {
	s.router.Run()
}
