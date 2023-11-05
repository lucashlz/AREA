const cors = require("cors");

const setupCorsMiddleware = (app) => {
    app.use(
        cors({
            origin: `http://localhost:8081`,
            credentials: true,
        })
    );
};

module.exports = setupCorsMiddleware;
