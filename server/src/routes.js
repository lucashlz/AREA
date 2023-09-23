const authRoutes = require("./routes/authRoutes");
const oauthRoutes = require("./routes/oauthRoutes");
const profileRoutes = require("./routes/profileRoutes");
const serviceRoutes = require("./routes/services");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use("/auth", authRoutes);
  app.use("/auth", oauthRoutes);
  app.use("/profile", profileRoutes);
  app.use("/services", serviceRoutes);
};
