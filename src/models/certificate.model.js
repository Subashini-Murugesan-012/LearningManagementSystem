import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CertificateSchema = new mongoose.Schema(
  {
    certificate_id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    certificate_name: { type: String, required: true },
    course_id: { type: String, required: true },
    student_id: { type: String, required: true },
    instructor_id: { type: String, required: true },
    issued_by: { type: String },
    issued_at: { type: Date, default: Date.now },
    certificate_url: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

export const Certificate = mongoose.model("Certificate", CertificateSchema);
