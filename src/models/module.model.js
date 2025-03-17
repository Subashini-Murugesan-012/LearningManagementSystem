import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ModuleSchema = new mongoose.Schema(
  {
    module_id: { type: String, default: uuidv4, unique: true, required: true },
    module_name: { type: String, required: true },
    description: { type: String },
    course_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

export const Module = mongoose.model("Module", ModuleSchema);
