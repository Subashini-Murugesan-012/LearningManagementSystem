import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const LessonSchema = new mongoose.Schema(
  {
    lesson_id: { type: String, default: uuidv4, unique: true, required: true },
    lesson_title: { type: String, required: true },
    content: { type: String },
    module_id: { type: String, required: true },
    course_id: { type: String, required: true },
    created_by: { type: String },
  },
  { timestamp: true }
);

export const Lesson = mongoose.model("Lesson", LessonSchema);
