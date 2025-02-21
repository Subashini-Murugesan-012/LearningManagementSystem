import express from "express";
import { createUser, loginUser } from "../controller/users.controller.js";
let router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);

export default router;
