const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resetRoutes = require("./routes/resetRoutes");
const usersRoutes = require("./routes/usersRoutes");
const connectRoutes = require("./routes/connectRoutes");
const areaRoutes = require("./routes/areaRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swaggerConfig");
const { ensureAuthenticated } = require("./middleware/middleware");

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/reset", resetRoutes);
  app.use("/profile", ensureAuthenticated, profileRoutes);
  app.use("/users", ensureAuthenticated, usersRoutes);
  app.use("/connect", connectRoutes);
  app.use("/areas", ensureAuthenticated, areaRoutes);
  app.use("/about", ensureAuthenticated, aboutRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
