import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MessageSchema = new mongoose.Schema(
  {
    message_id: { type: String, default: uuidv4, unique: true, required: true },
    sender_id: { type: String, required: true },
    content: { type: String, required: true },
    receiver_id: { type: String, required: true },
    sent_at: { type: Date, default: Date.now },
    is_read: { type: Boolean, default: false },
  },
  { timestamp: true }
);

export const Message = mongoose.model("Message", MessageSchema);
