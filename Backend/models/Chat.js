import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  userId: { type: String, required: true },
  query: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Chat = model("Chat", chatSchema);