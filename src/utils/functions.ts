import { Response ,Request} from "express-serve-static-core";
import UserAuthModel, { UserType } from "../app/models/userAuth-model";
import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import "dotenv/config"
export function generateRandomeNumber(length: number): number {
  if (length === 5) {
    return Math.floor(10000 + Math.random() * 90000);
  }
  if (length === 6) {
    return Math.floor(100000 + Math.random() * 900000);
  }
  return 0;
}
export function toPersianDigits(n: string): string {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

export async function setAccessToken(
  res: Response,
  user: UserType
): Promise<void> {
  res.cookie(
    "accessToken",
    await generateToken(
      user,
      process.env.ACCESS_TOKEN_EXPIRES_IN,
      process.env.ACCESS_TOKEN_SECRET_KEY
    ),
    {
      maxAge: 1000 * 60 * 60 * 24 * 1, // would expire after 1 days
      httpOnly: true, // The cookie only accessible by the web server
      signed: true, // Indicates if the cookie should be signed
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
      domain: process.env.DOMAIN,
      // domain:process.env.NODE_ENV === "development" ? "localhost" : ".fronthooks.ir",
    }
  );
}
export async function setRefreshToken(res:Response, user:UserType):Promise<void> {
  res.cookie(
    "refreshToken",
    await generateToken(user,process.env.REFRESH_TOKEN_EXPIRES_IN, process.env.REFRESH_TOKEN_SECRET_KEY),
    {
      maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 1 year
      httpOnly: true, // The cookie only accessible by the web server
      signed: true, // Indicates if the cookie should be signed
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development" ? false : true,
      domain: process.env.DOMAIN,
      // domain:
      //   process.env.NODE_ENV === "development" ? "localhost" : ".folan.ir",
    }
  );
}

function generateToken(
  user: UserType,
  expiresIn: string = "0",
  secret: string = ""
): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: user.id,
    };

    const options = {
      expiresIn,
    };

    JWT.sign(
      payload,
      secret || process.env.TOKEN_SECRET_KEY || "",
      options,
      (err: Error | null, token: string | undefined) => {
        if (err)
          return reject(createHttpError.InternalServerError("خطای سروری"));
        if (!token)
          return reject(createHttpError.InternalServerError("توکن تولید نشد"));
        resolve(token);
      }
    );
  });
}

export function verifyRefreshToken(req:Request) {
  const refreshToken = req.signedCookies["refreshToken"];
  if (!refreshToken) {
    throw createError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  const token = cookieParser.signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY || ""
  );
  if (!token) {
    throw createError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY||"",
      async (err, payload) => {
        try {
          if (err)
            reject(createError.Unauthorized("لطفا حساب کاربری خود شوید"));
          const { _id } = payload as {_id:string};
          const user = await UserAuthModel.findUserWithId(_id);
          if (!user.length) throw createHttpError.Unauthorized("حساب کاربری یافت نشد");
          return resolve(_id);
        } catch (error) {
          reject(createError.Unauthorized("حساب کاربری یافت نشد"));
        }
      }
    );
  });
}

