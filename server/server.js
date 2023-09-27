const express = require("express");
const { setupAppMiddleware } = require("./src/middleware/middleware");
const setupRoutes = require("./src/routes.js");
const connectDB = require("./src/config/dbConfig");
require('./src/auth/googleStrategy');
require('./src/auth/facebookStrategy');
require("dotenv").config();

const app = express();

const cors = require("cors");

app.use(cors());
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

setupAppMiddleware(app);

connectDB();

setupRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
