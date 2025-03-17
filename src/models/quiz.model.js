import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QuizSchema = new mongoose.Schema(
  {
    quiz_id: { type: String, default: uuidv4, unique: true, required: true },
    quiz_name: { type: String, required: true },
    course_id: { type: String, required: true },
    question: [
      {
        question_id: {
          type: String,
          default: uuidv4,
          unique: true,
          required: true,
        },
        question_text: { type: String, required: true },
        options: [{ type: String, required: true }],
        correct_answer: { type: String, required: true },
      },
    ],

    created_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

export const Quiz = mongoose.model("Quiz", QuizSchema);
