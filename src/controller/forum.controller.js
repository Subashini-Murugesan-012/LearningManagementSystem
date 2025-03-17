import { Assessment } from "../models/assessment.model";
import { Course } from "../models/courses.model";
import { ForumThread } from "../models/forum_thread.model";
import { Module } from "../models/module.model";

export let createForumThread = async (req, res) => {
  let { title, content, course_id, created_by } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!title || !course_id || !content) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    created_by = req.user.user_id;
    let forum_thread = new ForumThread({
      title,
      content,
      course_id,
      created_by,
    });
    await forum_thread.save();
    return res.status(200).json({
      message: "ForumThreads Created Successfully",
      forum_thread: forum_thread,
    });
  } catch (error) {
    console.log("Error while creating forum_thread", error);
    return res
      .status(500)
      .json({ message: "Error while creating forum_thread" });
  }
};

export let updateForumThread = async (req, res) => {
  let { forum_thread_id, title, content, course_id } = req.body;
  if (!forum_thread_id) {
    return res.status(400).json({ message: "forum_thread_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateForumThread = {};
    if (title) {
      updateForumThread.title = title;
    }
    if (content) {
      updateForumThread.content = content;
    }
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateForumThread.course_id = course_id;
    }
    let updatedForumThread = await ForumThread.findOneAndUpdate(
      { forum_thread_id },
      updateForumThread,
      {
        new: true,
      }
    );
    if (!updatedForumThread) {
      return res.status(404).json({ message: "ForumThread Not Found" });
    }
    return res.status(200).json({
      message: "ForumThread updated Successfully",
      forum_thread: updatedForumThread,
    });
  } catch (err) {
    console.log("Error while updating ForumThread", err);
    return res
      .status(500)
      .json({ message: "Error while updating ForumThread", err: err });
  }
};

export let getForumThread = async (req, res) => {
  let { forum_thread_id } = req.params;
  if (!forum_thread_id) {
    return res.status(400).json({ message: "ForumThread_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let forum_thread = await ForumThread.findOne({ forum_thread_id });
    if (!forum_thread) {
      return res.status(404).json({ message: "ForumThread Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the ForumThread", forum_thread: forum_thread });
  } catch (error) {
    console.log("Error while getting the forum_thread", error);
    return res
      .status(500)
      .json({ message: "Error while getting the forum_thread", error: error });
  }
};

export let getForumThreadList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.title) filter.title = req.body.title;
    if (req.body.content) filter.content = req.body.content;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    let forum_threads = await ForumThread.find(filter);
    return res
      .status(200)
      .json({ message: "ForumThreads List", forum_threads: forum_threads });
  } catch (error) {
    console.log("Error while getting the ForumThreads", error);
    return res
      .status(500)
      .json({ message: "Error while getting the forum_threads", error: error });
  }
};
