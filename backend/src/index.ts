import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import authRoutes from "./routes/auth";
import fleetRoutes from "./routes/fleet";
import ticketRoutes from "./routes/tickets";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/tickets", ticketRoutes);

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Anbessa API is running" });
});

// Start Server (only if not running in Vercel environment)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Anbessa Backend running at http://localhost:${PORT}`);
  });
}

export default app;
