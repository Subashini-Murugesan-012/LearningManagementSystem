import { Course } from "../models/courses.model.js";
import { User } from "../models/user.model.js";

export let createCourse = async (req, res) => {
  let {
    course_name,
    description,
    category,
    instructor_id,
    duration,
    language,
    level,
  } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!course_name || !category || !instructor_id || !duration || !level) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let instructor = await User.findById(instructor_id);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    if (typeof duration != "number") {
      return res.status(401).json({ messge: "Duration must be in numbers" });
    }
    let course = new Course({
      course_name,
      description,
      category,
      instructor_id,
      duration,
      language,
      level,
    });
    await course.save();
    return res
      .status(200)
      .json({ message: "Courses Created Successfully", course: course });
  } catch (error) {
    console.log("Error while creating course", error);
    return res.status(500).json({ message: "Error while creating course" });
  }
};

export let updateCourse = async (req, res) => {
  let {
    course_id,
    course_name,
    description,
    category,
    instructor_id,
    duration,
    language,
    level,
  } = req.body;
  if (!course_id) {
    return res.status(400).json({ message: "Course_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }
    let updateCourse = {};
    if (course_name) {
      updateCourse.course_name = course_name;
    }
    if (description) {
      updateCourse.description = description;
    }
    if (category) {
      updateCourse.category = category;
    }
    if (instructor_id) {
      updateCourse.instructor_id = instructor_id;
    }
    if (duration) {
      updateCourse.duration = duration;
    }
    if (language) {
      updateCourse.language = language;
    }
    if (level) {
      updateCourse.level = level;
    }
    // let updatedCourse = await Course.findByIdAndUpdate(
    //   course_id,
    //   updateCourse,
    //   { new: true }
    // );
    let updatedCourse = await Course.findOneAndUpdate(
      { course_id },
      updateCourse,
      {
        new: true,
      }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Course updated Successfully", course: updatedCourse });
  } catch (err) {
    console.log("Error while updating Course", err);
    return res
      .status(500)
      .json({ message: "Error while updating Course", err: err });
  }
};

export let getCourse = async (req, res) => {
  let { course_id } = req.params;
  if (!course_id) {
    return res.status(400).json({ message: "Course_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let course = await Course.findOne({ course_id });
    if (!course) {
      return res.status(404).json({ message: "Course Not Found" });
    }
    return res.status(200).json({ message: "Got the Course", course: course });
  } catch (error) {
    console.log("Error while getting the course", error);
    return res
      .status(500)
      .json({ message: "Error while getting the course", error: error });
  }
};

export let getCourseList = async (req, res) => {};
