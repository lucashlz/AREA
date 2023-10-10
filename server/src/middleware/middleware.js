const session = require('express-session');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const JWT_SECRET_KEY = "RAF";

exports.setupAppMiddleware = async (app) => {
    app.use(session({
        secret: 'RAF',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    }));
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: false,
        })
    );
    app.use(cookieParser());
    app.set("trust proxy", true);
    app.use(
        cors({
            origin: `http://localhost:8081`,
            credentials: true,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
};

exports.ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Failed to authenticate token" });
        }
        req.user = decoded;
        next();
    });
};
