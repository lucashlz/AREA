package main

import (
	"context"
	"log"
	"server/docs"
	"server/src/config"
	"server/src/routes"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	mongoClient := config.ConnectDB()
	defer mongoClient.Disconnect(context.TODO())

	r := gin.Default()
	store := cookie.NewStore([]byte("secret-key"))
	r.Use(sessions.Sessions("mysession", store))

	docs.SwaggerInfo.Title = "AREA API"
	docs.SwaggerInfo.Description = "This is a Swagger AREA API."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.Schemes = []string{"http"}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.Use(func(c *gin.Context) {
		c.Set("db", mongoClient)
		c.Next()
	})

	r.GET("/about", routes.AboutHandler)
	routes.AddUserRoutes(r)

	port := "8080"
	log.Printf("Server running on port %s", port)
	r.Run(":" + port)
}
