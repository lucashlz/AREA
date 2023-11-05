import routesSetup from "./src/routes";
import setupSessionMiddleware from "./src/middleware/general/sessionMiddleware";
import setupBodyParserMiddleware from "./src/middleware/general/bodyParserMiddleware";
import setupCorsMiddleware from "./src/middleware/general/corsMiddleware";
import setupPassportMiddleware from "./src/middleware/general/passportMiddleware";
import requestLogger from "./src/middleware/general/requestLoggerMiddleware";
import { checkAndReact } from "./src/core/areaTrigger";
import { startTokenRefreshCycle } from "./src/utils/token/tokenRefreshCycle";
import connectDB from "./src/config/dbConfig";

dotenv.config();
const app = express();

app.use(requestLogger);
setupSessionMiddleware(app);
setupBodyParserMiddleware(app);
setupCorsMiddleware(app);
setupPassportMiddleware(app);
routesSetup(app);

connectDB();

const PORT: number = parseInt(process.env.PORT || '8080', 10);
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    const EVALUATION_INTERVAL: number = 3000;
    setInterval(checkAndReact, EVALUATION_INTERVAL);
    startTokenRefreshCycle();
});
