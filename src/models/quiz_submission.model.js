import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QuizSubmissionSchema = new mongoose.Schema(
  {
    quiz_submission_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    student_id: { type: String, required: true },
    quiz_id: { type: String, required: true },
    answer: [
      {
        question_id: { type: String, required: true },
        selected_answer: { type: String, required: true },
      },
    ],
    score: { type: Number, default: 0 },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

export const QuizSubmission = mongoose.model(
  "QuizSubmission",
  QuizSubmissionSchema
);
