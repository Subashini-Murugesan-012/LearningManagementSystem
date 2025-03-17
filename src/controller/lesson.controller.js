import { Lesson } from "../model/LessonSchema.js";
import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";

export let createLesson = async (req, res) => {
  let { lesson_title, content, module_id, course_id, created_by } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!lesson_title || !course_id || !module_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let module = await Module.find({ where: { module_id: module_id } });
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    created_by = req.user.user_id;
    let lesson = new Lesson({
      lesson_title,
      content,
      course_id,
      module_id,
      created_by,
    });
    await lesson.save();
    return res
      .status(200)
      .json({ message: "Lessons Created Successfully", lesson: lesson });
  } catch (error) {
    console.log("Error while creating lesson", error);
    return res.status(500).json({ message: "Error while creating lesson" });
  }
};

export let updateLesson = async (req, res) => {
  let { lesson_id, lesson_title, content, course_id, module_id } = req.body;
  if (!lesson_id) {
    return res.status(400).json({ message: "lesson_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateLesson = {};
    if (lesson_title) {
      updateLesson.lesson_title = lesson_title;
    }
    if (content) {
      updateLesson.content = content;
    }
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateLesson.course_id = course_id;
    }
    if (module_id) {
      let module = await Course.find({ where: { module_id: module_id } });
      if (!module) {
        return res.status(404).json({ messag: "Module not found" });
      }
      updateLesson.module_id = module_id;
    }
    let updatedLesson = await Lesson.findOneAndUpdate(
      { lesson_id },
      updateLesson,
      {
        new: true,
      }
    );
    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Lesson updated Successfully", lesson: updatedLesson });
  } catch (err) {
    console.log("Error while updating Lesson", err);
    return res
      .status(500)
      .json({ message: "Error while updating Lesson", err: err });
  }
};

export let getLesson = async (req, res) => {
  let { lesson_id } = req.params;
  if (!lesson_id) {
    return res.status(400).json({ message: "Lesson_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let lesson = await Lesson.findOne({ lesson_id });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson Not Found" });
    }
    return res.status(200).json({ message: "Got the Lesson", lesson: lesson });
  } catch (error) {
    console.log("Error while getting the lesson", error);
    return res
      .status(500)
      .json({ message: "Error while getting the lesson", error: error });
  }
};

export let getLessonList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.lesson_title) filter.lesson_title = req.body.lesson_title;
    if (req.body.content) filter.content = req.body.content;
    if (req.body.module_id) filter.module_id = req.body.module_id;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    let lessons = await Lesson.find(filter);
    return res.status(200).json({ message: "Lessons List", lessons: lessons });
  } catch (error) {
    console.log("Error while getting the Lessons", error);
    return res
      .status(500)
      .json({ message: "Error while getting the lessons", error: error });
  }
};
