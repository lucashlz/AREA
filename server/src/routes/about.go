package routes

import (
	"github.com/gin-gonic/gin"
    "net/http"
)

func AboutHandler(c *gin.Context) {
    data := map[string]string{
        "message": "About Page",
    }
    c.JSON(http.StatusOK, data)
}

