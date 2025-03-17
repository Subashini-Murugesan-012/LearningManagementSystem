import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ProgressSchema = new mongoose.Schema(
  {
    progress_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    student_id: { type: String, required: true },
    lesson_id: { type: String, required: true },
    is_completed: { type: Boolean, default: false },
  },
  { timestamp: true }
);

export const Progress = mongoose.model("Progress", ProgressSchema);
