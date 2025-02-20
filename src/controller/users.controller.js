import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

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

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
