import express from "express";
import {
  createCourse,
  getCourse,
  updateCourse,
} from "../controller/courses.controller.js";
import { authenticationToken } from "../middleware/auth.js";

let router = express.Router();

router.post("/createCourse", authenticationToken, createCourse);
router.patch("/updateCourse", authenticationToken, updateCourse);
router.get("/getCourse/:course_id", authenticationToken, getCourse);

export default router;
