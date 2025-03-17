import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";
import { Enrollment } from "../models/enrollment.model";

export let createEnrollment = async (req, res) => {
  let { student_id, course_id } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!student_id || !course_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let student = await User.find({ where: { user_id: student_id } });
    if (!student) {
      return res.status(404).json({ messag: "Student not found" });
    }
    let enrollment = new Enrollment({
      student_id,
      course_id,
    });
    await enrollment.save();
    return res.status(200).json({
      message: "Enrollments Created Successfully",
      enrollment: enrollment,
    });
  } catch (error) {
    console.log("Error while creating enrollment", error);
    return res.status(500).json({ message: "Error while creating enrollment" });
  }
};

export let updateEnrollment = async (req, res) => {
  let { enrollment_id, course_id } = req.body;
  if (!enrollment_id) {
    return res.status(400).json({ message: "enrollment_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateEnrollment = {};
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateEnrollment.course_id = course_id;
    }
    let updatedEnrollment = await Enrollment.findOneAndUpdate(
      { enrollment_id },
      updateEnrollment,
      {
        new: true,
      }
    );
    if (!updatedEnrollment) {
      return res.status(404).json({ message: "Enrollment Not Found" });
    }
    return res.status(200).json({
      message: "Enrollment updated Successfully",
      enrollement: updatedEnrollment,
    });
  } catch (err) {
    console.log("Error while updating Enrollment", err);
    return res
      .status(500)
      .json({ message: "Error while updating Enrollment", err: err });
  }
};

export let getEnrollment = async (req, res) => {
  let { enrollment_id } = req.params;
  if (!enrollment_id) {
    return res.status(400).json({ message: "Enrollment_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let enrollement = await Enrollment.findOne({ enrollment_id });
    if (!enrollement) {
      return res.status(404).json({ message: "Enrollment Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Enrollment", enrollement: enrollement });
  } catch (error) {
    console.log("Error while getting the enrollement", error);
    return res
      .status(500)
      .json({ message: "Error while getting the enrollement", error: error });
  }
};

export let getEnrollmentList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.enrollment_id) filter.enrollment_id = req.body.enrollment_id;
    if (req.body.student_id) filter.student_id = req.body.student_id;
    if (req.body.enrollment_at) filter.enrollment_at = req.body.enrollment_at;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    let enrollments = await Enrollment.find(filter);
    return res
      .status(200)
      .json({ message: "Enrollments List", enrollments: enrollments });
  } catch (error) {
    console.log("Error while getting the Enrollments", error);
    return res
      .status(500)
      .json({ message: "Error while getting the enrollments", error: error });
  }
};
