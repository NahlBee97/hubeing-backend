import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { FE_URL } from "./config";
import { globalErrorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// Routes

// cors
app.use(
  cors({
    origin: FE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.get("/", (req: Request, res: Response) => {
  res.send("Jatmiko Backend Connected");
});

// Main Endpoints

// --- Central Error Handler ---
app.use(globalErrorHandler);

export default app;
