import { Assessment } from "../models/assessment.model";
import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";

export let createPayment = async (req, res) => {
  let { student_id, course_id, amount, currency, payment_method } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!student_id || !course_id || !payment_method) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let payment = new Payment({
      student_id,
      payment_method,
      course_id,
      amount,
      currency,
    });
    await payment.save();
    return res.status(200).json({
      message: "Payments Created Successfully",
      payment: payment,
    });
  } catch (error) {
    console.log("Error while creating payment", error);
    return res.status(500).json({ message: "Error while creating payment" });
  }
};

export let updatePayment = async (req, res) => {
  let { payment_id, student_id, course_id, amount, currency, payment_method } =
    req.body;
  if (!payment_id) {
    return res.status(400).json({ message: "payment_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updatePayment = {};
    if (student_id) {
      updatePayment.student_id = student_id;
    }
    if (amount) {
      updatePayment.amount = amount;
    }
    if (payment_method) {
      updatePayment.payment_method = payment_method;
    }
    if (payment_status) {
      updatePayment.payment_status = payment_status;
    }

    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updatePayment.course_id = course_id;
    }
    let updatedPayment = await Payment.findOneAndUpdate(
      { payment_id },
      updatePayment,
      {
        new: true,
      }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment Not Found" });
    }
    return res.status(200).json({
      message: "Payment updated Successfully",
      assessment: updatedPayment,
    });
  } catch (err) {
    console.log("Error while updating Payment", err);
    return res
      .status(500)
      .json({ message: "Error while updating Payment", err: err });
  }
};

export let getPayment = async (req, res) => {
  let { payment_id } = req.params;
  if (!payment_id) {
    return res.status(400).json({ message: "Payment_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let payment = await Payment.findOne({ payment_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Payment", payment: payment });
  } catch (error) {
    console.log("Error while getting the payment", error);
    return res
      .status(500)
      .json({ message: "Error while getting the payment", error: error });
  }
};

export let getPaymentList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.student_id) filter.student_id = req.body.student_id;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    if (req.body.amount) filter.amount = req.body.amount;
    if (req.body.currency) filter.currency = req.body.currency;
    if (req.body.transaction_id)
      filter.transaction_id = req.body.transaction_id;
    if (req.body.payment_method)
      filter.payment_method = req.body.payment_method;
    if (req.body.payment_status)
      filter.payment_status = req.body.payment_status;
    if (req.body.payment_at) filter.payment_at = req.body.payment_at;

    let payments = await Payment.find(filter);
    return res
      .status(200)
      .json({ message: "Payments List", payments: payments });
  } catch (error) {
    console.log("Error while getting the Payments", error);
    return res
      .status(500)
      .json({ message: "Error while getting the payments", error: error });
  }
};
