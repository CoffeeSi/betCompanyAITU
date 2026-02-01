package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/CoffeeSi/betCompanyAITU/internal/database"
	"github.com/CoffeeSi/betCompanyAITU/internal/repository"
	"github.com/CoffeeSi/betCompanyAITU/internal/server"
	"github.com/CoffeeSi/betCompanyAITU/internal/service"
	"github.com/CoffeeSi/betCompanyAITU/internal/worker"
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

	// Start event worker
	eventWorker := worker.NewEventWorker(db.DB)
	go eventWorker.Start()

	// Setup graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// Server init and run
	server := server.NewServer(services)
	go server.Run()

	// Wait for shutdown signal
	<-sigChan
	fmt.Println("\nShutdown signal received, stopping worker...")
	eventWorker.Stop()
	fmt.Println("Graceful shutdown complete")
}
