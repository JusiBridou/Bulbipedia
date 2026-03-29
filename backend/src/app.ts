import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import articleRouter from "./routes/article.routes";
import ratingRouter from "./routes/rating.routes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((value) => value.trim())
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/articles", articleRouter);
app.use("/api/articles", ratingRouter);

app.use(errorHandler);

export default app;
