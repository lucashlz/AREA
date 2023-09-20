package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"server/src/database"
	"server/src/models"
	"server/src/utils"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// @Summary Facebook Authentication Callback
// @Description Handle callback from Facebook after user authentication
// @Tags Users
// @Router /users/authentication/facebook/callback [get]
func FacebookCallback(c *gin.Context) {
	state := c.DefaultQuery("state", "")
	code := c.DefaultQuery("code", "")

	session := sessions.Default(c)
	storedState := session.Get("oauth2_state")
	if storedState != state {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Errors: []Error{{Msg: "Invalid state"}}})
		return
	}

	fbToken, err := Facebookoauth2Config.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to exchange token"}}})
		return
	}

	client := Facebookoauth2Config.Client(context.Background(), fbToken)
	resp, err := client.Get("https://graph.facebook.com/me?fields=id,name,email")
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to fetch user profile"}}})
		return
	}
	defer resp.Body.Close()
	if err := json.NewDecoder(resp.Body).Decode(&facebookUser); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to decode user profile"}}})
		return
	}
	user, exists := database.GetUserByEmail(facebookUser.Email, c)

	if !exists {
		user = models.User{
			Email: facebookUser.Email,
			Name:  facebookUser.Name,
		}
		database.SaveUser(user, c)
	}
	userToken, err := utils.MakeToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Internal server error"}}})
		return
	}

	session = sessions.Default(c)

	session.Set("userToken", userToken)

	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to save session"}}})
		return
	}
	//to change
	//c.Redirect(http.StatusFound, "/")
}

// @Summary Google Authentication Callback
// @Description Handle callback from Google after user authentication
// @Tags Users
// @Router /users/authentication/google/callback [get]
func GoogleCallback(c *gin.Context) {
	state := c.DefaultQuery("state", "")
	code := c.DefaultQuery("code", "")

	session := sessions.Default(c)
	storedState := session.Get("oauth2_state")
	if storedState != state {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Errors: []Error{{Msg: "Invalid state"}}})
		return
	}

	googleToken, err := googleOauth2Config.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to exchange token"}}})
		return
	}

	client := googleOauth2Config.Client(context.Background(), googleToken)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to fetch user profile"}}})
		return
	}
	defer resp.Body.Close()
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to decode user profile"}}})
		return
	}
	user, exists := database.GetUserByEmail(googleUser.Email, c)

	if !exists {
		user = models.User{
			Email: googleUser.Email,
			Name:  googleUser.Name,
		}
		database.SaveUser(user, c)
	}
	userToken, err := utils.MakeToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Internal server error"}}})
		return
	}

	session.Set("userToken", userToken)

	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Failed to save session"}}})
		return
	}

	//to change
	//c.Redirect(http.StatusFound, "/")
}
