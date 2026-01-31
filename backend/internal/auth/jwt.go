package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var securityKey = []byte(os.Getenv("JWT_SECRET"))

func CreateToken(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"user_id": userID,
			"exp":     time.Now().Add(24 * time.Hour).Unix(),
		})
	tokenString, err := token.SignedString(securityKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) (uint, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.MapClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return securityKey, nil
		})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(*jwt.MapClaims)
	userID := uint((*claims)["user_id"].(float64))

	if !ok || !token.Valid {
		return 0, jwt.ErrTokenInvalidClaims
	}

	fmt.Println(userID)
	return userID, nil
}
