import { Schema, model } from "mongoose";
const userSchema = new Schema({
  userId: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
export const User = model("User", userSchema);
