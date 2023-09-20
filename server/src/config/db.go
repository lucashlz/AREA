package config

import (
    "context"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "log"
)

func ConnectDB() *mongo.Client {
    clientOptions := options.Client().ApplyURI("mongodb://mongo:27017/area")
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }
    return client
}
