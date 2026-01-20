import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});
