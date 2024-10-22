import express from "express";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import userAuthController from "../http/controllers/userAuth-controller";
import { UserFullInfo, UserType } from "../models/userAuth-model";
import { verifyAccessToken } from "../http/middlewares/user-middleware";

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
    userFullInfo: UserFullInfo;
  };
}>;

export type RequestCompleteProfile = Request<
  {},
  {},
  { name: string; email: string; role: number }
>;
export type ResponseCompleteProfile = Response<{
  statusCode: number;
  data: {
    message: string;
    userFullInfo: UserFullInfo;
  };
}>;

export type RequestRefreshToken = Request;
export type ResponseRefreshToken = Response<{
  statusCode: number;
  data: {
    user:UserType;
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

router.post(
  "/complete-profile",
  verifyAccessToken,
  tryCatchHandler<RequestCompleteProfile, ResponseCompleteProfile>(
    userAuthController.completeProfile
  )
);

router.get(
  "/refresh-token",
  tryCatchHandler<RequestRefreshToken, ResponseRefreshToken>(
    userAuthController.refreshToken
  )
);

export default router;
