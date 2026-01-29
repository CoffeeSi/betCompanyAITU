package main

import (
	"fmt"

	"github.com/CoffeeSi/betCompanyAITU/internal/database"
	"github.com/CoffeeSi/betCompanyAITU/internal/model"
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

	db.DB.AutoMigrate(&model.User{}, &model.Wallet{}, &model.Transaction{}, &model.Bet{})

	// Three-Layered Architecture: handler -> service -> repository
	userRepository := repository.NewUserRepository(db.DB)
	userService := service.NewUserService(userRepository)

	// Server init and run
	server := server.NewServer(userService)
	server.Run()
}
