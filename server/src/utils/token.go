package utils

import (
	"server/src/models"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const jwtSecret = "JWT_SECRET"

func MakeToken(user models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": user.Email,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
