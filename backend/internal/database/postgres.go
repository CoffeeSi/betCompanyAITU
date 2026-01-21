package database

import (
	"context"
	"fmt"

	"github.com/CoffeeSi/betCompanyAITU/internal/config"
	"github.com/jackc/pgx/v5"
)

type Database struct {
	Connect *pgx.Conn
}

func NewDatabase() (*Database, error) {
	dbConfigs := config.Load()
	connectURL := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbConfigs.DB_USER,
		dbConfigs.DB_PASSWORD,
		dbConfigs.DB_HOST,
		dbConfigs.DB_PORT,
		dbConfigs.DB_NAME,
	)

	conn, err := pgx.Connect(context.Background(), connectURL)
	if err != nil {
		fmt.Printf("error: %s", err.Error())
		return nil, err
	}

	return &Database{
		Connect: conn,
	}, nil
}
