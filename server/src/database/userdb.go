package database

import (
	"github.com/gin-gonic/gin"
	"context"
	"net/http"
	"server/src/models"
	"go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/bson"
)

type ErrorResponse struct {
	Errors []Error `json:"errors"`
}
type Error struct {
	Msg string `json:"msg"`
}

func UserExists(email string, c *gin.Context) bool {
    client := c.MustGet("db").(*mongo.Client)
    collection := client.Database("area").Collection("users")
    filter := bson.M{"email": email}
    err := collection.FindOne(context.TODO(), filter).Err()
    return err != mongo.ErrNoDocuments
}

func SaveUser(user models.User, c *gin.Context) {
    client := c.MustGet("db").(*mongo.Client)
    collection := client.Database("area").Collection("users")
    _, err := collection.InsertOne(context.TODO(), user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to register the user."}}})
        return
    }
}

func GetUserByEmail(email string, c *gin.Context) (models.User, bool) {
    var user models.User
    client := c.MustGet("db").(*mongo.Client)
    collection := client.Database("area").Collection("users")
    filter := bson.M{"email": email}
    err := collection.FindOne(context.TODO(), filter).Decode(&user)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return models.User{}, false
        }
        c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to fetch user details."}}})
        return models.User{}, false
    }
    return user, true
}
