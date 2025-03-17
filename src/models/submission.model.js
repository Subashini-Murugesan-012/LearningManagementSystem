import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SubmissionSchema = new mongoose.Schema(
  {
    submission_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    assessment_id: { type: String, required: true },
    instructor_id: { type: String, required: false },
    total_marks: { type: Number, required: true },
    grade: { type: Number, default: null },
    submission_file: { type: String, required: true },
    language: { type: String, default: "English" },
    feedback: {
      type: String,
    },
    graded_at: { type: Date },
  },
  { timestamp: true }
);

export const Submission = mongoose.model("Submission", SubmissionSchema);
