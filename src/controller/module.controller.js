import { Course } from "../models/courses.model";
import { Module } from "../models/module.model";

export let createModule = async (req, res) => {
  let { module_name, description, course_id } = req.body;
  if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (!module_name || !course_id) {
    return res.status(401).json({ message: "Fill the required fields" });
  }
  try {
    let course = await Course.find({ where: { course_id: course_id } });
    if (!course) {
      return res.status(404).json({ messag: "Course not found" });
    }
    let module = new Module({
      module_name,
      description,
      course_id,
    });
    await module.save();
    return res
      .status(200)
      .json({ message: "Modules Created Successfully", module: module });
  } catch (error) {
    console.log("Error while creating module", error);
    return res.status(500).json({ message: "Error while creating module" });
  }
};

export let updateModule = async (req, res) => {
  let { module_id, module_name, description, course_id } = req.body;
  if (!module_id) {
    return res.status(400).json({ message: "module_id needed" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidden" });
    }

    let updateModule = {};
    if (module_name) {
      updateModule.module_name = module_name;
    }
    if (description) {
      updateModule.description = description;
    }
    if (course_id) {
      let course = await Course.find({ where: { course_id: course_id } });
      if (!course) {
        return res.status(404).json({ messag: "Course not found" });
      }
      updateModule.course_id = course_id;
    }
    let updatedModule = await Module.findOneAndUpdate(
      { module_id },
      updateModule,
      {
        new: true,
      }
    );
    if (!updatedModule) {
      return res.status(404).json({ message: "Module Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Module updated Successfully", module: updatedModule });
  } catch (err) {
    console.log("Error while updating Module", err);
    return res
      .status(500)
      .json({ message: "Error while updating Module", err: err });
  }
};

export let getModule = async (req, res) => {
  let { module_id } = req.params;
  if (!module_id) {
    return res.status(400).json({ message: "Module_id needed!" });
  }
  try {
    if (req.user.role !== "Admin" && req.user.role !== "Instructor") {
      return res.status(403).json({ message: "Forbidded" });
    }
    let module = await Module.findOne({ module_id });
    if (!module) {
      return res.status(404).json({ message: "Module Not Found" });
    }
    return res.status(200).json({ message: "Got the Module", module: module });
  } catch (error) {
    console.log("Error while getting the module", error);
    return res
      .status(500)
      .json({ message: "Error while getting the module", error: error });
  }
};

export let getModuleList = async (req, res) => {
  try {
    let filter = {};
    if (req.body.module_name) filter.module_name = req.body.module_name;
    if (req.body.description) filter.description = req.body.description;
    if (req.body.module_id) filter.module_id = req.body.module_id;
    if (req.body.course_id) filter.course_id = req.body.course_id;
    let modules = await Module.find(filter);
    return res.status(200).json({ message: "Modules List", modules: modules });
  } catch (error) {
    console.log("Error while getting the Modules", error);
    return res
      .status(500)
      .json({ message: "Error while getting the modules", error: error });
  }
};
