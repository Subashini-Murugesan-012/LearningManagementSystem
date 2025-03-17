import { Assessment } from "../models/assessment.model";
import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";

export let createQuiz = async (req, res) => {
  let { quiz_name, course_id, question } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!quiz_name || !course_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let quiz = new Quiz({
      quiz_name,
      question,
      course_id,
    });
    await quiz.save();
    return res.status(200).json({
      message: "Quizs Created Successfully",
      quiz: quiz,
    });
  } catch (error) {
    console.log("Error while creating quiz", error);
    return res.status(500).json({ message: "Error while creating quiz" });
  }
};

export let updateQuiz = async (req, res) => {
  let { quiz_id, quiz_name, question, course_id } = req.body;
  if (!quiz_id) {
    return res.status(400).json({ message: "quiz_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateQuiz = {};
    if (quiz_name) {
      updateQuiz.quiz_name = quiz_name;
    }
    if (question) {
      updateQuiz.question = question;
    }
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateQuiz.course_id = course_id;
    }
    let updatedQuiz = await Quiz.findOneAndUpdate({ quiz_id }, updateQuiz, {
      new: true,
    });
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz Not Found" });
    }
    return res.status(200).json({
      message: "Quiz updated Successfully",
      quiz: updatedQuiz,
    });
  } catch (err) {
    console.log("Error while updating Quiz", err);
    return res
      .status(500)
      .json({ message: "Error while updating Quiz", err: err });
  }
};

export let getQuiz = async (req, res) => {
  let { quiz_id } = req.params;
  if (!quiz_id) {
    return res.status(400).json({ message: "Quiz_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let quiz = await Quiz.findOne({ quiz_id });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz Not Found" });
    }
    return res.status(200).json({ message: "Got the Quiz", quiz: quiz });
  } catch (error) {
    console.log("Error while getting the quiz", error);
    return res
      .status(500)
      .json({ message: "Error while getting the quiz", error: error });
  }
};

export let getQuizList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.quiz_name) filter.quiz_name = req.body.quiz_name;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    if (req.body.question) filter.question = req.body.question;
    let quizes = await Quiz.find(filter);
    return res.status(200).json({ message: "Quizs List", quizes: quizes });
  } catch (error) {
    console.log("Error while getting the Quizs", error);
    return res
      .status(500)
      .json({ message: "Error while getting the quizes", error: error });
  }
};
