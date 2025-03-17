import express from "express";
import {
  createCourse,
  getCourse,
  getCourseList,
  updateCourse,
} from "../controller/courses.controller.js";
import { authenticationToken } from "../middleware/auth.js";

let router = express.Router();

router.post("/createCourse", authenticationToken, createCourse);
router.patch("/updateCourse", authenticationToken, updateCourse);
router.get("/getCourse/:course_id", authenticationToken, getCourse);
router.get("/getCoursesList", getCourseList);

export default router;
