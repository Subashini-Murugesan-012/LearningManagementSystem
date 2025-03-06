import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export let createUser = async (req, res) => {
  let { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Fill all the required fields" });
  }
  try {
    if (name.length < 4) {
      return res
        .status(400)
        .json({ message: "Name should be more than 4 letters" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter valid email address" });
    }
    if (password.length < 4) {
      return res
        .status(400)
        .json({ message: "Password should be more than 4 letters" });
    }
    password = await bcrypt.hash(password, 10);
    let newUser = new User({ name, email, password, role });
    await newUser.save();
    return res
      .status(200)
      .json({ message: "User Created Successfully", user: newUser });
  } catch (error) {
    console.log("Error while creating User", error);
    return res
      .status(500)
      .json({ message: "Error while creating user", error: error });
  }
};

export let loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Fill the required fields" });
  }
  try {
    let user = await User.find({ email: email });
    console.log("User", user);
    if (user.length == 0) {
      return res.status(404).json({ message: "User Not found" });
    }
    let isPassword = await bcrypt.compare(password, user[0].password);
    console.log(isPassword);
    if (!isPassword) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let sessionToken = jwt.sign(
      {
        user_id: user[0].id,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      message: "Login Successful",
      sessionToken: sessionToken,
      user: user[0],
    });
  } catch (error) {
    console.log("Error while login", error);
    return res.status(500).json({ message: "Error while login", error: error });
  }
};

export let updateUser = async (req, res) => {
  try {
    let { user_id, name, email } = req.body;
    if (!user_id) {
      return res.status(400).json({ message: "UserId Required" });
    }
    let updatedUser = {};
    if (name) {
      updatedUser.name = name;
    }
    if (email) {
      let isValid = isValidEmail(email);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid email" });
      }
      updatedUser.email = email;
    }
    let updateUser = await User.findByIdAndUpdate(user_id, updatedUser, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User Updated Successfully", user: updateUser });
  } catch (error) {
    console.log("Error while updating user", error);
    return res
      .status(500)
      .json({ message: "Error while updating user", error: error });
  }
};

export let getMe = async (req, res) => {
  let user_id = req.user.user_id;
  let user = await User.findById(user_id);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  return res.status(200).json({ message: "This is Your Profile", user: user });
};

export let deleteUser = async (req, res) => {
  let { user_id } = req.body;
  let user = await User.findById(user_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  let deletedUser = await User.findByIdAndDelete(user_id);
  return res
    .status(200)
    .json({ message: "User Deleted Successfully", deletedUser: deletedUser });
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
