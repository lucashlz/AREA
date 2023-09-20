package routes

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"regexp"
	"server/src/database"
	"server/src/models"
	"server/src/utils"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func generateUniqueState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// @Summary User Registration
// @Description Register a new user to the system
// @Tags Users
// @Accept  json
// @Produce  json
// @Param user body models.User true "User registration info (Email must be in valid format)"
// @Success 200 {object} TokenResponse "Successfully registered user with a token"
// @Failure 400 {object} ErrorResponse "Bad request or Invalid email format"
// @Failure 409 {object} ErrorResponse "User with the given email already exists"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /users/authentication/sign_up [post]
func SignUp(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Errors: []Error{{Msg: "Bad request"}}})
		return
	}

	if !emailRegex.MatchString(user.Email) {
		c.JSON(http.StatusBadRequest, ErrorResponse{Errors: []Error{{Msg: "Invalid email format"}}})
		return
	}

	if database.UserExists(user.Email, c) {
		c.JSON(http.StatusConflict, ErrorResponse{Errors: []Error{{Msg: "User with the given email already exists."}}})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Internal server error"}}})
		return
	}
	user.Password = string(hashedPassword)
	database.SaveUser(user, c)
	token, err := utils.MakeToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Internal server error"}}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// @Summary User Login
// @Description Authenticate a user and return a token
// @Tags Users
// @Accept  json
// @Produce  json
// @Param user body models.User true "User authentication info (Email must be in valid format)"
// @Success 200 {object} TokenResponse "Successfully authenticated user with a token"
// @Failure 400 {object} ErrorResponse "Bad request or Invalid email format"
// @Failure 401 {object} ErrorResponse "Invalid credentials or user doesn't exist"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /users/authentication/log_in [post]
func LogIn(c *gin.Context) {
	var user models.User

	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Errors: []Error{{Msg: "Bad request"}}})
		return
	}
	if !emailRegex.MatchString(user.Email) {
		c.JSON(http.StatusBadRequest, ErrorResponse{Errors: []Error{{Msg: "Invalid email format"}}})
		return
	}
	storedUser, exists := database.GetUserByEmail(user.Email, c)
	if !exists {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Errors: []Error{{Msg: "User does not exist"}}})
		return
	}
	err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Errors: []Error{{Msg: "Invalid credentials"}}})
		return
	}
	token, err := utils.MakeToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Errors: []Error{{Msg: "Internal server error"}}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// @Summary Facebook Authentication
// @Description Authenticate user via Facebook and return a token
// @Tags Users
// @Accept  json
// @Produce  json
// @Success 200 {object} TokenResponse "Successfully authenticated user with a token"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /users/authentication/facebook [get]
func FacebookAuth(c *gin.Context) {
	uniqueState := generateUniqueState()

	session := sessions.Default(c)
	session.Set("oauth2_state", uniqueState)
	session.Save()

	url := Facebookoauth2Config.AuthCodeURL(uniqueState) + "&skip_api_login=1"
	c.Redirect(http.StatusFound, url)
}

// @Summary Google Authentication
// @Description Authenticate user via Google and return a token
// @Tags Users
// @Accept  json
// @Produce  json
// @Success 200 {object} TokenResponse "Successfully authenticated user with a token"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /users/authentication/google [get]
func GoogleAuth(c *gin.Context) {
	uniqueState := generateUniqueState()
	session := sessions.Default(c)
	session.Set("oauth2_state", uniqueState)
	session.Save()

	url := googleOauth2Config.AuthCodeURL(uniqueState) + "&skip_api_login=1"
	c.Redirect(http.StatusFound, url)
}

func AddUserRoutes(r *gin.Engine) {
	r.POST("/users/authentication/sign_up", SignUp)
	r.POST("/users/authentication/log_in", LogIn)
	r.GET("/users/authentication/facebook", FacebookAuth)
	r.GET("/users/authentication/facebook/callback", FacebookCallback)
	r.GET("/users/authentication/google", GoogleAuth)
	r.GET("/users/authentication/google/callback", GoogleCallback)
}
