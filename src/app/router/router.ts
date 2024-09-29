import express from "express";
import userAuthRoutee from "./userAuth";
const router = express.Router();

router.use("/user", userAuthRoutee);

export default router;
