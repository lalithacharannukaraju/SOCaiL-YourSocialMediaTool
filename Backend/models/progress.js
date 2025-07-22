import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  history: { type: Map, of: Boolean, default: {} },
});

export default mongoose.model("ProgressTracker", progressSchema);
