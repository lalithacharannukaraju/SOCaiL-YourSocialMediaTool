import { Schema, model, mongoose } from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  history: { type: Map, of: Boolean, default: {} },
});

export default mongoose.model("ProgressTracker", progressSchema);
