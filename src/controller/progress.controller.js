import { Lesson } from "../models/lesson.mode";
import { Progress } from "../models/progress.model";

export let createProgress = async (req, res) => {
  let { student_id, lesson_id, is_completed } = req.body;
  if (req.user.role !== "Student") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!student_id || !lesson_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let lesson = await Lesson.find({ where: { lesson_id: lesson_id } });
    if (!lesson) {
      return res.status(404).json({ messag: "Lesson not found" });
    }
    let student = await User.find({ where: { user_id: student_id } });
    if (!student) {
      return res.status(404).json({ messag: "Lesson not found" });
    }
    is_completed = false;
    let progress = new Progress({
      student_id,
      is_completed,
      lesson_id,
    });
    await progress.save();
    return res
      .status(200)
      .json({ message: "Progresss Created Successfully", progress: progress });
  } catch (error) {
    console.log("Error while creating progress", error);
    return res.status(500).json({ message: "Error while creating progress" });
  }
};

export let updateProgress = async (req, res) => {
  let { progress_id, lesson_id, is_completed } = req.body;
  if (!progress_id) {
    return res.status(400).json({ message: "progress_id needed" });
  }
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let updateProgress = {};
    if (is_completed) {
      updateProgress.is_completed = is_completed;
    }
    if (lesson_id) {
      let lesson = await Lesson.find({ where: { lesson_id: lesson_id } });
      if (!lesson) {
        return res.status(404).json({ messag: "Lesson not found" });
      }
      updateProgress.lesson_id = lesson_id;
    }
    let updatedProgress = await Progress.findOneAndUpdate(
      { progress_id },
      updateProgress,
      {
        new: true,
      }
    );
    if (!updatedProgress) {
      return res.status(404).json({ message: "Progress Not Found" });
    }
    return res.status(200).json({
      message: "Progress updated Successfully",
      module: updatedProgress,
    });
  } catch (err) {
    console.log("Error while updating Progress", err);
    return res
      .status(500)
      .json({ message: "Error while updating Progress", err: err });
  }
};

export let getProgress = async (req, res) => {
  let { progress_id } = req.params;
  if (!progress_id) {
    return res.status(400).json({ message: "Progress_id needed!" });
  }
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    let progress = await Progress.findOne({ progress_id });
    if (!progress) {
      return res.status(404).json({ message: "Progress Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Progress", progress: progress });
  } catch (error) {
    console.log("Error while getting the progress", error);
    return res
      .status(500)
      .json({ message: "Error while getting the progress", error: error });
  }
};

export let getProgressList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.progress_id) filter.progress_id = req.body.progress_id;
    if (req.body.student_id) filter.student_id = req.body.student_id;
    if (req.body.lesson_id) filter.lesson_id = req.body.lesson_id;
    if (req.body.is_completed) filter.is_completed = req.body.is_completed;
    let progress = await Progress.find(filter);
    return res
      .status(200)
      .json({ message: "Progress List", progress: progress });
  } catch (error) {
    console.log("Error while getting the Progress", error);
    return res
      .status(500)
      .json({ message: "Error while getting the progress", error: error });
  }
};
