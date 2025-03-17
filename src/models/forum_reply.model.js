import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ForumReplySchema = new mongoose.Schema(
  {
    forum_reply_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    forum_thread_id: { type: String, required: true },
    content: { type: String },
    created_by: { type: String, required: true },
  },
  { timestamp: true }
);

export const ForumReply = mongoose.model("ForumReply", ForumReplySchema);
