import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PaymentSchema = new mongoose.Schema(
  {
    payment_id: { type: String, default: uuidv4, unique: true, required: true },
    student_id: { type: String, required: true },
    course_id: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    transaction_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    payment_method: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending",
    },
    payment_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

export const Course = mongoose.model("Course", PaymentSchema);
