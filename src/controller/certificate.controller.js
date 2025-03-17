import { Assessment } from "../models/assessment.model";
import { Certificate } from "../models/certificate.model";
import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";
import { Users } from "../models/user.model";

export let createCertificate = async (req, res) => {
  let {
    certificate_name,
    student_id,
    course_id,
    instructor_id,
    issued_by,
    certificate_url,
  } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!certificate_name || !course_id || !student_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let certificate = new Certificate({
      certificate_name,
      student_id,
      course_id,
      instructor_id,
      issued_by,
      certificate_url,
    });
    await certificate.save();
    return res.status(200).json({
      message: "Certificates Created Successfully",
      certificate: certificate,
    });
  } catch (error) {
    console.log("Error while creating certificate", error);
    return res
      .status(500)
      .json({ message: "Error while creating certificate" });
  }
};

export let updateCertificate = async (req, res) => {
  let {
    cerificate_id: certificate_id,
    certificate_name,
    student_id,
    course_id,
    instructor_id,
    issued_by,
    certificate_url,
  } = req.body;
  if (!certificate_id) {
    return res.status(400).json({ message: "cerificate_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateCertificate = {};
    if (certificate_name) {
      updateCertificate.certificate_name = certificate_name;
    }
    if (student_id) {
      let student = await Users.find({ where: { user_id: student_id } });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      updateCertificate.student_id = student_id;
    }
    if (instructor_id) {
      let instructor = await Users.find({ where: { user_id: instructor_id } });
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      updateCertificate.instructor_id = instructor_id;
    }
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateCertificate.course_id = course_id;
    }
    if (issued_by) {
      updateCertificate.issued_by = issued_by;
    }
    if (certificate_url) {
      updateCertificate.certificate_url = certificate_url;
    }
    let updatedCertificate = await Certificate.findOneAndUpdate(
      { certificate_id },
      updateCertificate,
      {
        new: true,
      }
    );
    if (!updatedCertificate) {
      return res.status(404).json({ message: "Certificate Not Found" });
    }
    return res.status(200).json({
      message: "Certificate updated Successfully",
      certificate: updatedCertificate,
    });
  } catch (err) {
    console.log("Error while updating Certificate", err);
    return res
      .status(500)
      .json({ message: "Error while updating Certificate", err: err });
  }
};

export let getCertificate = async (req, res) => {
  let { certificate_id } = req.params;
  if (!certificate_id) {
    return res.status(400).json({ message: "Certificate_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let certificate = await Certificate.findOne({ certificate_id });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Got the Certificate", certificate: certificate });
  } catch (error) {
    console.log("Error while getting the certificate", error);
    return res
      .status(500)
      .json({ message: "Error while getting the certificate", error: error });
  }
};

export let getCertificateList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.cerificate_id) filter.cerificate_id = req.body.cerificate_id;
    if (req.body.certificate_name)
      filter.certificate_name = req.body.certificate_name;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    if (req.body.student_id) filter.student_id = req.body.student_id;
    if (req.body.instructor_id) filter.instructor_id = req.body.instructor_id;
    if (req.body.issued_by) filter.issued_by = req.body.issued_by;
    if (req.body.certificate_url)
      filter.certificate_url = req.body.certificate_url;

    let certificates = await Certificate.find(filter);
    return res
      .status(200)
      .json({ message: "Certificates List", certificates: certificates });
  } catch (error) {
    console.log("Error while getting the Certificates", error);
    return res
      .status(500)
      .json({ message: "Error while getting the certificates", error: error });
  }
};
