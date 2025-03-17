import { Assessment } from "../models/assessment.model";
import { Course } from "../models/courses.model";
import { Message } from "../models/message.model";
import { Module } from "../models/module.model";

export let createMessage = async (req, res) => {
  let { sender_id, receiver_id, content } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!sender_id || !content || !receiver_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let message = new Message({
      sender_id,
      receiver_id,
      content,
    });
    await message.save();
    return res.status(200).json({
      message: "Messages Created Successfully",
      message: message,
    });
  } catch (error) {
    console.log("Error while creating message", error);
    return res.status(500).json({ message: "Error while creating message" });
  }
};

export let updateMessage = async (req, res) => {
  let { message_id, sender_id, receiver_id, content, is_read } = req.body;
  if (!message_id) {
    return res.status(400).json({ message: "message_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateMessage = {};
    if (sender_id) {
      updateMessage.sender_id = sender_id;
    }
    if (receiver_id) {
      updateMessage.receiver_id = receiver_id;
    }
    if (content) {
      updateMessage.content = content;
    }
    if (is_read) {
      updateMessage.is_read = is_read;
    }

    let updatedMessage = await Message.findOneAndUpdate(
      { message_id },
      updateMessage,
      {
        new: true,
      }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message Not Found" });
    }
    return res.status(200).json({
      message: "Message updated Successfully",
      assessment: updatedMessage,
    });
  } catch (err) {
    console.log("Error while updating Message", err);
    return res
      .status(500)
      .json({ message: "Error while updating Message", err: err });
  }
};

export let getMessage = async (req, res) => {
  let { messsage_id } = req.params;
  if (!messsage_id) {
    return res.status(400).json({ message: "Message_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let message = await Message.findOne({ messsage_id });
    if (!message) {
      return res.status(404).json({ message: "Message Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Message", message: message });
  } catch (error) {
    console.log("Error while getting the message", error);
    return res
      .status(500)
      .json({ message: "Error while getting the message", error: error });
  }
};

export let getMessageList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.message_id) filter.message_id = req.body.message_id;
    if (req.body.sender_id) filter.sender_id = req.body.sender_id;
    if (req.body.content) filter.content = req.body.content;
    if (req.body.receiver_id) filter.receiver_id = req.body.receiver_id;
    if (req.body.sent_at) filter.sent_at = req.body.sent_at;
    if (req.body.is_read) filter.is_read = req.body.is_read;

    let messages = await Message.find(filter);
    return res
      .status(200)
      .json({ message: "Messages List", messages: messages });
  } catch (error) {
    console.log("Error while getting the Messages", error);
    return res
      .status(500)
      .json({ message: "Error while getting the messages", error: error });
  }
};
