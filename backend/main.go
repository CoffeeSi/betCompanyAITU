package main

import (
	"fmt"

	"github.com/CoffeeSi/betCompanyAITU/internal/database"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"github.com/CoffeeSi/betCompanyAITU/internal/server"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
)

func main() {
	// Database init
	db, err := database.NewDatabase()
	if err != nil {
		fmt.Printf("error: %s", err.Error())
		return
	}

	// Three-Layered Architecture: handler -> service -> repository
	userRepository := repository.NewUserRepository(db.DB)
	walletRepository := repository.NewWalletRepository(db.DB)
	userService := service.NewUserService(userRepository, walletRepository)
	walletService := service.NewWalletService(walletRepository)

	sportRepository := repository.NewSportRepository(db.DB)
	sportService := service.NewSportService(sportRepository)

	// Server init and run
	server := server.NewServer(userService, walletService, sportService)
	server.Run()
}
