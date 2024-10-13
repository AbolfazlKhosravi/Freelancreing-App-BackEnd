import express from "express";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import userAuthController from "../http/controllers/userAuth-controller";

const router = express.Router();

router.post(
  "/get-otp",
  tryCatchHandler<Request<{}, {}, { phoneNumber: string }>, Response>(
    userAuthController.getOtp
  )
);

export default router;
