package routes

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
)

var facebookUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
var (
	Facebookoauth2Config = &oauth2.Config{
		ClientID:     "880076359796025",
		ClientSecret: "c9754ad1c936ba18199deec571c329e9",
		RedirectURL:  "http://localhost:8080/users/authentication/facebook/callback",
		Scopes:       []string{"public_profile", "email"},
		Endpoint:     facebook.Endpoint,
	}
	oauth2State = "randomStateString"
)

var googleUser struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
var googleOauth2Config = &oauth2.Config{
	ClientID:     "401713114122-kjd1c8n7ml8fp5v33hrkqeiq3d34nans.apps.googleusercontent.com",
	ClientSecret: "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",
	RedirectURL:  "http://localhost:8080/users/authentication/google/callback",
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
	Endpoint:     google.Endpoint,
}

type ErrorResponse struct {
	Errors []Error `json:"errors"`
}

type Error struct {
	Msg string `json:"msg"`
}

type TokenResponse struct {
	Token string `json:"token"`
}
