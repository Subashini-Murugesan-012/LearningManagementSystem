import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const AssessmentSchema = new mongoose.Schema(
  {
    assessment_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    assessment_name: { type: String, required: true },
    course_id: { type: String, required: true },
    due_date: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

export const Assessment = mongoose.model("Assessment", AssessmentSchema);
