import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const EnrollmentSchema = new mongoose.Schema(
  {
    enrollment_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    student_id: { type: String, required: true },
    course_id: { type: String, required: true },
    enrollment_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

export const Enrollement = mongoose.model("Enrollment", EnrollmentSchema);
