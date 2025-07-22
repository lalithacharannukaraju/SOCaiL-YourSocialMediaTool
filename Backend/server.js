import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Authenticate middleware
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ...decoded, id: decoded.userId }; // Ensure we have userId available as id
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Connect to Database
const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Progress Tracker Schema
const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const ProgressTracker = mongoose.model("ProgressTracker", progressSchema);

// Progress Routes
const progressRouter = express.Router();

// Get or auto-create progress for the authenticated user
progressRouter.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let progress = await ProgressTracker.findOne({ userId });
    if (!progress) {
      progress = new ProgressTracker({ userId });
      await progress.save();
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// Update progress (streak)
progressRouter.patch("/update", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { success } = req.body;
    let progress = await ProgressTracker.findOne({ userId });
    if (!progress) {
      progress = new ProgressTracker({ userId });
    }
    const now = new Date();
    const lastUpdate = new Date(progress.lastUpdated);
    if (!isSameDay(lastUpdate, now) && success) {
      progress.currentStreak += 1;
      progress.highestStreak = Math.max(progress.highestStreak, progress.currentStreak);
    } else if (!success) {
      progress.currentStreak = 0;
    }
    progress.lastUpdated = now;
    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// Helper function for date comparison
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

app.use("/progress", progressRouter);

// Other Routes
app.use("/auth", authRoutes);
app.use("/", chatRoutes);

startServer();