import { ForumReply } from "../models/forum_reply.model";
import { ForumThread } from "../models/forum_thread.model";

export let createForumReply = async (req, res) => {
  let { forum_thread_id, content, created_by } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!forum_thread_id || !created_by || !content) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let forum_reply = new ForumReply({
      forum_thread_id,
      content,
      created_by,
    });
    await forum_reply.save();
    return res.status(200).json({
      message: "ForumReplys Created Successfully",
      forum_reply: forum_reply,
    });
  } catch (error) {
    console.log("Error while creating forum_reply", error);
    return res
      .status(500)
      .json({ message: "Error while creating forum_reply" });
  }
};

export let updateForumReply = async (req, res) => {
  let { forum_reply_id, forum_thread_id, content } = req.body;
  if (!forum_reply_id) {
    return res.status(400).json({ message: "forum_reply_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateForumReply = {};
    if (forum_reply_id) {
      updateForumReply.forum_reply_id = forum_reply_id;
    }
    if (content) {
      updateForumReply.content = content;
    }
    if (forum_thread_id) {
      let forum_thread = await ForumThread.find({
        where: { forum_thread_id: forum_thread_id },
      });
      if (!forum_thread) {
        return res.status(404).json({ messag: "Forum Thread not found" });
      }
      updateForumReply.forum_thread_id = forum_thread_id;
    }
    let updatedForumReply = await ForumReply.findOneAndUpdate(
      { forum_reply_id },
      updateForumReply,
      {
        new: true,
      }
    );
    if (!updatedForumReply) {
      return res.status(404).json({ message: "ForumReply Not Found" });
    }
    return res.status(200).json({
      message: "ForumReply updated Successfully",
      assessment: updatedForumReply,
    });
  } catch (err) {
    console.log("Error while updating ForumReply", err);
    return res
      .status(500)
      .json({ message: "Error while updating ForumReply", err: err });
  }
};

export let getForumReply = async (req, res) => {
  let { forum_reply_id } = req.params;
  if (!forum_reply_id) {
    return res.status(400).json({ message: "ForumReply_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let forum_reply = await ForumReply.findOne({ forum_reply_id });
    if (!forum_reply) {
      return res.status(404).json({ message: "ForumReply Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the ForumReply", forum_reply: forum_reply });
  } catch (error) {
    console.log("Error while getting the forum_reply", error);
    return res
      .status(500)
      .json({ message: "Error while getting the forum_reply", error: error });
  }
};

export let getForumReplyList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.forum_reply_id)
      filter.forum_reply_id = req.body.forum_reply_id;
    if (req.body.forum_thread_id)
      filter.forum_thread_id = req.body.forum_thread_id;
    if (req.body.content) filter.content = req.body.content;
    if (req.body.created_by) filter.created_by = req.body.created_by;
    let forum_threads = await ForumReply.find(filter);
    return res
      .status(200)
      .json({ message: "ForumReplys List", forum_threads: forum_threads });
  } catch (error) {
    console.log("Error while getting the ForumReplys", error);
    return res
      .status(500)
      .json({ message: "Error while getting the forum_threads", error: error });
  }
};
