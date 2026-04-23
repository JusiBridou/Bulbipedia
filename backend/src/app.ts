import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import articleRouter from "./routes/article.routes";
import ratingRouter from "./routes/rating.routes";
import adminRouter from "./routes/admin.routes";
import userRouter from "./routes/user.routes";
import uploadRouter from "./routes/upload.routes";

const app = express();
const uploadsDir = path.resolve(process.cwd(), "uploads");

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((value) => value.trim())
  })
);
app.use("/uploads", express.static(uploadsDir));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/articles", ratingRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;
