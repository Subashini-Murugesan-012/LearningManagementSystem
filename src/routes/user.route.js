import express from "express";
import {
  createUser,
  deleteUser,
  getMe,
  loginUser,
  updateUser,
} from "../controller/users.controller.js";
import { authenticationToken } from "../middleware/auth.js";
let router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.put("/updateUser", authenticationToken, updateUser);
router.get("/getMe", authenticationToken, getMe);
router.delete("/deleteUser", authenticationToken, deleteUser);

export default router;
