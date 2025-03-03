import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export let authenticationToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }
    let decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error while authenticate", error);
    return res
      .status(500)
      .json({ message: "Error while authenticate", error: error });
  }
};
