import { app } from "./app";
import { sequelize } from "./config/data-base";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";

const PORT = Number(process.env.PORT) || 3000;

app.use(cookieParser());
app.use("/auth", authRoutes);

async function connectWithRetry(retries = 10, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("Database connected");
      return;
    } catch (error) {
      console.error(
        `DB connection failed (${i}/${retries}). Retrying in ${delayMs}ms...`
      );
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  throw new Error("Could not connect to database after retries");
}

async function bootstrap() {
  try {
    await connectWithRetry();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
