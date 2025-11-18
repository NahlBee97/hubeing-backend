import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { FE_URL } from "./config";
import { globalErrorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// Routes
import AuthRouter from "./routes/authRoutes";
import AppointmentRouter from "./routes/appointmentRoutes"
import UserRouter from "./routes/userRoutes"

// cors
app.use(
  cors({
    origin: FE_URL,
    credentials: true,
  })
);

app.use(express.json());

// --- Routes ---
app.get("/", (req: Request, res: Response) => {
  res.send("Connected");
});

// Main Endpoints
app.use("/api/auth", AuthRouter);
app.use("/api/appointments", AppointmentRouter);
app.use("/api/users", UserRouter)

// --- Central Error Handler ---
app.use(globalErrorHandler);

export default app;
