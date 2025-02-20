import express from "express";
import { createUser } from "../controller/users.controller.js";
let router = express.Router();

router.post("/createUser", createUser);

export default router;
