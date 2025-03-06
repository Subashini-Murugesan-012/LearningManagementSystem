import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CoursesSchema = new mongoose.Schema(
  {
    course_id: { type: String, default: uuidv4, unique: true, required: true },
    course_name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    instructor_id: { type: String, required: true },
    duration: { type: Number, required: true },
    language: { type: String, default: "English" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
  },
  { timestamp: true }
);

export const Course = mongoose.model("Course", CoursesSchema);
