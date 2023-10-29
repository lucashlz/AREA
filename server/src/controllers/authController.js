const User = require("../models/userModels");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const emailService = require("../utils/emailUtils");
const { findUserByExternalId, createNewExternalUser } = require("../utils/authUtils");

exports.sign_up = async (req, res) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!req.body.email || !emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!req.body.username) {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!req.body.authProvider && !req.body.password) {
            return res.status(400).json({ message: "Password is required" });
        }

        let user = await User.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        user = new User(req.body);

        user.username = req.body.username;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const confirmationToken = crypto.randomBytes(20).toString("hex");
        user.confirmationToken = confirmationToken;

        await user.save();

        emailService.sendConfirmationMail(user.email, confirmationToken);

        res.status(200).json({ message: "User registered. Please confirm your email." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.confirm = async (req, res) => {
    try {
        const user = await User.findOne({ confirmationToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }
        user.confirmed = true;
        user.confirmationToken = undefined;
        await user.save();
        res.status(200).json({ message: "Account confirmed successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.confirmEmailChange = async (req, res) => {
    try {
        const user = await User.findOne({ emailChangeToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        if (user.pendingEmail) {
            user.email = user.pendingEmail;
            user.pendingEmail = undefined;
        }

        user.emailChangeToken = undefined;
        await user.save();
        res.status(200).json({ message: "Email changed successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.sign_in = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.confirmed) {
            return res.status(400).json({ message: "Please confirm your account first" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
            expiresIn: "24h",
        });
        res.status(200).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.redirectToGoogle = (req, res) => {
    const redirectUri = "http://localhost:8080/auth/google/callback";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&scope=profile%20email`;
    res.redirect(authUrl);
};

exports.handleGoogleCallback = async (req, res) => {
    const code = req.query.code;
    const redirectUri = "http://localhost:8080/auth/google/callback";

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code: code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        });
        const { access_token } = response.data;
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': 'Bearer ' + access_token,
            }
        });
        const email = profileResponse.data.email;
        let existingUser = await findUserByExternalId("google", email);
        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_JWT, { expiresIn: '24h' });
            return res.status(200).redirect(`http://localhost:8081/applets?token=${token}`);
        }
        const newUser = await createNewExternalUser("google", email);
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_JWT, { expiresIn: '24h' });
        res.status(200).redirect(`http://localhost:8081/applets?token=${token}`);
    } catch (error) {
        console.error("Error during Google authentication:", error);
        return res.status(500).json({ message: "Server error during authentication." });
    }
};
