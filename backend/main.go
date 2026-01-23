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
	database, err := database.NewDatabase()
	fmt.Println("My name is Denis")
	if err != nil {
		fmt.Printf("error: %s", err.Error())
		return
	}
	fmt.Println("IVAN KUZNETSOV BRANCH")

	
	// Three-Layered Architecture: handler -> service -> repository
	repository := repository.NewRepository(database)
	service := service.NewService(repository)

	// Server init and run
	server := server.NewServer(service)
	server.Run()
}
