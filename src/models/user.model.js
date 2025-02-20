import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Admin", "Instructor", "Student"] },
    password: { type: String, required: true },
  },
  { timestamp: true }
);

export const User = mongoose.model("User", UserSchema);
