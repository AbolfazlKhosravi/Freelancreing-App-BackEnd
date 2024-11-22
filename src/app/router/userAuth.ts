import express from "express";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import UserAuthController from "../http/controllers/userAuth-controller";
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
    user: UserType;
  };
}>;

export type RequestGetUserProfile = Request;
export type ResponseGetUserProfile = Response<{
  statusCode: number;
  data: {
    userFullInfo: UserFullInfo;
  };
}>;

router.post(
  "/get-otp",
  tryCatchHandler<RequestGetOtp, ResponseGetOtp>(UserAuthController.getOtp)
);

router.post(
  "/check-otp",
  tryCatchHandler<RequestCheckOtp, ResponseCheckOtp>(
    UserAuthController.checkOtp
  )
);

router.post(
  "/complete-profile",
  verifyAccessToken,
  tryCatchHandler<RequestCompleteProfile, ResponseCompleteProfile>(
    UserAuthController.completeProfile
  )
);

router.get(
  "/refresh-token",
  tryCatchHandler<RequestRefreshToken, ResponseRefreshToken>(
    UserAuthController.refreshToken
  )
);

router.get(
  "/profile",
  verifyAccessToken,
  tryCatchHandler<RequestGetUserProfile, ResponseGetUserProfile>(
    UserAuthController.getUserProfile
  )
);

export type RequestLogout=Request
export type ResponseLogout = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

router.post(
  "/logout",
  tryCatchHandler<RequestLogout, ResponseLogout>(UserAuthController.logout)
);

export default router;
