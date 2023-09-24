const authRoutes = require("./routes/authRoutes");
const OAuth2Routes = require("./routes/OAuth2Routes");
const profileRoutes = require("./routes/profileRoutes");
const resetRoutes = require("./routes/resetRoutes");
const usersRoutes = require("./routes/usersRoutes");
const connectRoutes = require("./routes/connectRoutes");
const serviceRoutes = require("./routes/services");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");
const { authMiddleware } = require('./middleware/middleware');

module.exports = (app) => {
  app.use("/auth", authRoutes);
  app.use("/OAuth2", OAuth2Routes);
  app.use("/reset", resetRoutes);
  app.use('/profile', authMiddleware, profileRoutes);
  app.use("/users", usersRoutes);
  app.use("connect", connectRoutes);
  app.use("/services", serviceRoutes);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

};
