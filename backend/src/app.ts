import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.route";
import authRouter from "./routes/auth.route";
import taskRouter from "./routes/task.route";
import userRoutes from "./routes/user.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
  }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);



export default app;
