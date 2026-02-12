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
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Initialize handler container
	handlers := handler.NewHandlers(services)
	adminOnly := RequireRoles(services.User, "admin")
	staffAccess := RequireRoles(services.User, "admin", "moderator")

	// Auth routes
	router.POST("/api/auth/register", handlers.User.RegisterUser)
	router.POST("/api/auth/login", handlers.User.LoginUser)
	router.GET("/api/auth/token/refresh", handlers.User.RefreshToken)

	// User routes
	router.GET("/api/users/profile", handlers.User.GetProfile)
	router.PATCH("/api/users/:id/role", adminOnly, handlers.User.AssignRole)

	// Wallet routes
	router.GET("/api/wallet", handlers.Wallet.GetPersonalWallet)
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
	router.GET("/api/teams/id/:id", handlers.Team.GetTeam)
	router.POST("/api/teams", adminOnly, handlers.Team.CreateTeam)
	router.PUT("/api/teams/:id", adminOnly, handlers.Team.UpdateTeam)
	router.DELETE("/api/teams/:id", adminOnly, handlers.Team.DeleteTeam)

	// Event routes
	router.GET("/api/events", handlers.Event.ListEvents)
	router.GET("/api/events/:id", handlers.Event.GetEvent)
	router.GET("/api/events/team/:teamId", handlers.Event.ListEventsByTeam)
	router.POST("/api/events", adminOnly, handlers.Event.CreateEvent)
	router.PUT("/api/events/:id", adminOnly, handlers.Event.UpdateEvent)
	router.DELETE("/api/events/:id", adminOnly, handlers.Event.DeleteEvent)

	// Outcome routes
	router.PUT("/api/outcomes/:id/odds", staffAccess, handlers.Outcome.UpdateOdds)

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
