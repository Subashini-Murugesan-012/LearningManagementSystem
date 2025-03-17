import { Assessment } from "../models/assessment.model";
import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";
import { Submission } from "../models/submission.model";

export let createSubmission = async (req, res) => {
  let {
    assessment_id,
    instructor_id,
    total_marks,
    grade,
    submission_file,
    language,
    feedback,
  } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!assessment_id || !total_marks || !instructor_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let assessment = await Assessment.find({
      where: { assessment_id: assessment_id },
    });
    if (!assessment) {
      return res.status(404).json({ messag: "Assessment not found" });
    }
    let submission = new Submission({
      assessment_id,
      instructor_id,
      total_marks,
      grade,
      submission_file,
      language,
      feedback,
    });
    await submission.save();
    return res.status(200).json({
      message: "Submissions Created Successfully",
      submission: submission,
    });
  } catch (error) {
    console.log("Error while submission", error);
    return res.status(500).json({ message: "Error while submission" });
  }
};

export let updateSubmission = async (req, res) => {
  let {
    submission_id,
    total_marks,
    grade,
    submission_file,
    language,
    feedback,
    graded_at,
  } = req.body;
  if (!submission_id) {
    return res.status(400).json({ message: "submission_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateSubmission = {};
    if (total_marks) {
      updateSubmission.total_marks = total_marks;
    }
    if (grade) {
      updateSubmission.grade = grade;
    }
    if (submission_file) {
      updateSubmission.submission_file = submission_file;
    }
    if (language) {
      updateSubmission.language = language;
    }
    if (feedback) {
      updateSubmission.feedback = feedback;
    }
    if (graded_at) {
      updateSubmission.graded_at = graded_at;
    }
    let updatedSubmission = await Submission.findOneAndUpdate(
      { submission_id },
      updateSubmission,
      {
        new: true,
      }
    );
    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission Not Found" });
    }
    return res.status(200).json({
      message: "Submission updated Successfully",
      submission: updatedSubmission,
    });
  } catch (err) {
    console.log("Error while updating Submission", err);
    return res
      .status(500)
      .json({ message: "Error while updating Submission", err: err });
  }
};

export let getSubmission = async (req, res) => {
  let { submission_id } = req.params;
  if (!submission_id) {
    return res.status(400).json({ message: "Submission_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let submission = await Submission.findOne({ submission_id });
    if (!submission) {
      return res.status(404).json({ message: "Submission Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Submission", submission: submission });
  } catch (error) {
    console.log("Error while getting the submission", error);
    return res
      .status(500)
      .json({ message: "Error while getting the submission", error: error });
  }
};

export let getSubmissionList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.submission_id) filter.submission_id = req.body.submission_id;
    if (req.body.instructor_id) filter.instructor_id = req.body.instructor_id;
    if (req.body.total_marks) filter.total_marks = req.body.total_marks;
    if (req.body.grade) filter.grade = req.body.grade;
    if (req.body.language) filter.language = req.body.language;
    if (req.body.feedback) filter.feedback = req.body.feedback;
    if (req.body.graded_at) filter.graded_at = req.body.graded_at;

    let submitted_items = await Submission.find(filter);
    return res
      .status(200)
      .json({ message: "Submissions List", submitted_items: submitted_items });
  } catch (error) {
    console.log("Error while getting the Submissions", error);
    return res
      .status(500)
      .json({
        message: "Error while getting the submitted_items",
        error: error,
      });
  }
};
