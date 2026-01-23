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
	if err != nil {
		fmt.Printf("error: %s", err.Error())
		return
	}
	func CreateBet(c *gin.Context) {
	var bet Bet
	if err := c.ShouldBindJSON(&bet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&bet)
	c.JSON(http.StatusCreated, bet)
}

	func GetBets(c *gin.Context) {
	var bets []Bet
	db.Find(&bets)
	c.JSON(http.StatusOK, bets)
}

	func GetBet(c *gin.Context) {
	id := c.Param("id")
	var bet Bet
	if result := db.First(&bet, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bet not found"})
		return
	}
	c.JSON(http.StatusOK, bet)
}

	func UpdateBet(c *gin.Context) {
	id := c.Param("id")
	var bet Bet

	if err := db.First(&bet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bet not found"})
		return
	}

	if err := c.ShouldBindJSON(&bet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&bet)
	c.JSON(http.StatusOK, bet)
}

	func DeleteBet(c *gin.Context) {
	id := c.Param("id")
	db.Delete(&Bet{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
	

	// Three-Layered Architecture: handler -> service -> repository
	repository := repository.NewRepository(database)
	service := service.NewService(repository)

	// Server init and run
	server := server.NewServer(service)
	server.Run()
}
