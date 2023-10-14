const express = require("express");
const { setupAppMiddleware } = require("./src/middleware/middleware");
const { checkAndReact } = require("./src/core/areaTrigger");
const { refreshTokensForAllUsers } = require("./src/utils/tokenUtils");
const setupRoutes = require("./src/routes.js");
const connectDB = require("./src/config/dbConfig");
require("dotenv").config();
function logRequestInfo(req, res, next) {
    console.log("----- Incoming Request -----");
    console.log("Time:", new Date().toISOString());
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers:", JSON.stringify(req.headers, null, 2));

    if (req.body && Object.keys(req.body).length) {
        console.log("Body:", JSON.stringify(req.body, null, 2));
    }

    next();
}

const app = express();
app.use(logRequestInfo);
setupAppMiddleware(app);
connectDB();
setupRoutes(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    const REFRESH_INTERVAL = 60 * 60 * 1000;

    function recursiveRefresh() {
        refreshTokensForAllUsers();

        let startTime = Date.now();
        let endTime = startTime + REFRESH_INTERVAL;

        function printTimeRemaining() {
            let now = Date.now();
            let timeRemaining = Math.round((endTime - now) / 1000);
            console.log(`Time until next token refresh: ${timeRemaining} seconds`);

            if (now < endTime) {
                setTimeout(printTimeRemaining, 60000);
            } else {
                recursiveRefresh();
            }
        }
        printTimeRemaining();
    }
    // const EVALUATION_INTERVAL = 2000;
    // setInterval(checkAndReact, EVALUATION_INTERVAL);
    recursiveRefresh();
});