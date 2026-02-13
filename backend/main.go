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
)

func main() {
	// Database init
	db, err := database.NewDatabase()
	if err != nil {
		fmt.Printf("Failed to connect to database: %s\n", err.Error())
		fmt.Println("Please ensure PostgreSQL is running and environment variables are set correctly")
		return
	}
	fmt.Println("✓ Database connected successfully")

	// Three-Layered Architecture: handler -> service -> repository
	repos := repository.NewRepositories(db.DB)
	services := service.NewServices(repos)

	// Start event worker
	// eventWorker := worker.NewEventWorker(db.DB)
	// go eventWorker.Start()

	// Setup graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// Server init and run
	server := server.NewServer(services)
	fmt.Println("✓ Server initialized")
	fmt.Println("🚀 Starting server on http://localhost:8080")
	go server.Run()

	// Wait for shutdown signal
	<-sigChan
	fmt.Println("\nShutdown signal received, stopping worker...")
	// eventWorker.Stop()
	fmt.Println("Graceful shutdown complete")
}
