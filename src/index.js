import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();
let app = express();

app.use(express.json());

connectDB();

// routes
app.use("/user", userRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server Started on http://localhost:${process.env.PORT}`);
});
