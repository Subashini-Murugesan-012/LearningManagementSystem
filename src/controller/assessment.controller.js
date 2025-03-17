import { Assessment } from "../models/assessment.model";
import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";

export let createAssessment = async (req, res) => {
  let { assessment_name, due_date, course_id } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!assessment_name || !course_id || !due_date) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let assessment = new Assessment({
      assessment_name,
      due_date,
      course_id,
    });
    await assessment.save();
    return res.status(200).json({
      message: "Assessments Created Successfully",
      assessment: assessment,
    });
  } catch (error) {
    console.log("Error while creating assessment", error);
    return res.status(500).json({ message: "Error while creating assessment" });
  }
};

export let updateAssessment = async (req, res) => {
  let { assessment_id, assessment_name, due_date, course_id } = req.body;
  if (!assessment_id) {
    return res.status(400).json({ message: "assessment_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateAssessment = {};
    if (assessment_name) {
      updateAssessment.assessment_name = assessment_name;
    }
    if (due_date) {
      updateAssessment.due_date = due_date;
    }
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateAssessment.course_id = course_id;
    }
    let updatedAssessment = await Assessment.findOneAndUpdate(
      { assessment_id },
      updateAssessment,
      {
        new: true,
      }
    );
    if (!updatedAssessment) {
      return res.status(404).json({ message: "Assessment Not Found" });
    }
    return res.status(200).json({
      message: "Assessment updated Successfully",
      assessment: updatedAssessment,
    });
  } catch (err) {
    console.log("Error while updating Assessment", err);
    return res
      .status(500)
      .json({ message: "Error while updating Assessment", err: err });
  }
};

export let getAssessment = async (req, res) => {
  let { assessment_id } = req.params;
  if (!assessment_id) {
    return res.status(400).json({ message: "Assessment_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let assessment = await Assessment.findOne({ assessment_id });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Assessment", assessment: assessment });
  } catch (error) {
    console.log("Error while getting the assessment", error);
    return res
      .status(500)
      .json({ message: "Error while getting the assessment", error: error });
  }
};

export let getAssessmentList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.assessment_name)
      filter.assessment_name = req.body.assessment_name;
    if (req.body.assessment_id) filter.assessment_id = req.body.assessment_id;
    if (req.body.due_date) filter.due_date = req.body.due_date;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    let assessments = await Assessment.find(filter);
    return res
      .status(200)
      .json({ message: "Assessments List", assessments: assessments });
  } catch (error) {
    console.log("Error while getting the Assessments", error);
    return res
      .status(500)
      .json({ message: "Error while getting the assessments", error: error });
  }
};
