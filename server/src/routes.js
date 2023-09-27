const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resetRoutes = require("./routes/resetRoutes");
const usersRoutes = require("./routes/usersRoutes");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swaggerConfig");
const { authMiddleware } = require("./middleware/middleware");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/reset", resetRoutes);
  app.use("/profile", authMiddleware, profileRoutes);
  app.use("/users", authMiddleware, usersRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
