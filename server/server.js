const express = require("express");
const { setupAppMiddleware } = require("./src/middleware/middleware");
const setupRoutes = require("./src/routes.js");
const connectDB = require("./src/config/db");
require("dotenv").config();

const app = express();

setupAppMiddleware(app);

connectDB();

setupRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
