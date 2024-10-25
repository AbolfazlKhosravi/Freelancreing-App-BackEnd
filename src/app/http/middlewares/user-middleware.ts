import JWT from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express-serve-static-core";
import createHttpError from "http-errors";
import "dotenv/config";
import UserAuthModel from "../../models/userAuth-model";
export async function verifyAccessToken(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.signedCookies["accessToken"];
    if (!accessToken) {
      throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
    }
    const token = cookieParser.signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY || ""
    );
    if (!token) {
      throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
    }
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY || "",
      async (err, payload) => {
        try {
          if (err) throw createHttpError.Unauthorized("توکن نامعتبر است");
          const { _id } = payload as { _id: string };
          const user = await UserAuthModel.findUserWithId(_id);
          if (!user.length) throw createHttpError.Unauthorized("حساب کاربری یافت نشد");
          req.user=user[0]
          return next();
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

export async function isVerifiedUser(req:Request, _res:Response, next:NextFunction) {
  try {
    const user = req.user;
    if(!user) throw createHttpError.Unauthorized("کاربری یافت نشد")
    if (user.status === 1) {
      throw createHttpError.Forbidden("پروفایل شما در انتظار بررسی است.");
    }
    if (user.status !== 2) {
      throw createHttpError.Forbidden(
        "پروفایل شما مورد تایید قرار نگرفته است."
      );
    }
    return next();
  } catch (error) {
    next(error);
  }
}
