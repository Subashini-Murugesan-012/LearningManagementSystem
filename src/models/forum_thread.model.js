import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ForumThreadSchema = new mongoose.Schema(
  {
    forum_thread_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String },
    course_id: { type: String, required: true },
    created_by: { type: String, required: true },
  },
  { timestamp: true }
);

export const ForumThread = mongoose.model("ForumThread", ForumThreadSchema);
