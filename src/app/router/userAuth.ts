import express from "express";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import userAuthController from "../http/controllers/userAuth-controller";
import { UserType } from "../models/userAuth-model";

const router = express.Router();

export type RequestGetOtp = Request<{}, {}, { phoneNumber: string }>;
export type ResponseGetOtp = Response<{
  statusCode: number;
  message?: string;
  data?: {
    message: string;
    expiresIn: number;
    phoneNumber: string;
  };
}>;
export type RequestCheckOtp = Request<
  {},
  {},
  { otp: number; phoneNumber: string }
>;
export type ResponseCheckOtp = Response<{
  statusCode: number;
  message?: string;
  data?: {
    message: string;
    user: UserType;
  };
}>;

router.post(
  "/get-otp",
  tryCatchHandler<RequestGetOtp, ResponseGetOtp>(userAuthController.getOtp)
);

router.post(
  "/check-otp",
  tryCatchHandler<RequestCheckOtp, ResponseCheckOtp>(
    userAuthController.checkOtp
  )
);

export default router;
