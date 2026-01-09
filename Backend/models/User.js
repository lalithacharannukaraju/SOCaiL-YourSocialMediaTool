import { Schema, model, mongoose } from "mongoose";
const userSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
export const User = model("User", userSchema);
