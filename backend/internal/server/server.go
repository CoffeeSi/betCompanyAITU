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

func NewServer(services *service.Services) *Server {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Initialize handler container
	handlers := handler.NewHandlers(services)

	// Auth routes
	router.POST("/api/auth/register", handlers.User.RegisterUser)
	router.POST("/api/auth/login", handlers.User.LoginUser)
	router.GET("/api/auth/token/refresh", handlers.User.RefreshToken)

	// Wallet routes
	router.GET("/api/wallet/:userId", handlers.Wallet.GetWallet)
	router.POST("/api/wallet/:userId/deposit", handlers.Wallet.Deposit)
	router.POST("/api/wallet/:userId/withdraw", handlers.Wallet.Withdraw)
	router.POST("/api/wallet/:userId/win", handlers.Wallet.Win)
	router.GET("/api/wallet/:userId/transactions", handlers.Wallet.ListTransactions)

	// Sport routes
	router.GET("/api/sports", handlers.Sport.ListSports)

	// Team routes
	router.GET("/api/teams", handlers.Team.ListTeams)
	router.GET("/api/teams/:sportId", handlers.Team.ListTeamsBySport)

	// Event routes
	router.GET("/api/events", handlers.Event.ListEvents)
	router.GET("/api/events/:teamId", handlers.Event.ListEventsByTeam)

	//Bet routes
	router.POST("/api/bet", handlers.Bet.CreateBet)
	router.PUT("/api/bet", handlers.Bet.SettleBet)

	return &Server{
		router: router,
	}
}

func (s *Server) Run() {
	s.router.Run()
}
