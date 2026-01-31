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
	repos := repository.NewRepositories(db.DB)
	services := service.NewServices(repos)

	// Server init and run
	server := server.NewServer(services)
	server.Run()
}
