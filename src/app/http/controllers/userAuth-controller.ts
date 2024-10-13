import createError from "http-errors";
import { Request, Response } from "express-serve-static-core";
import {
  generateRandomeNumber,
  toPersianDigits,
} from "../../../utils/functions";
import UserAuthModel, {
  ResultAuthentication,
} from "../../models/userAuth-model";
import Kavenegar from "kavenegar";
import "dotenv/config";
import { StatusCodes as HttpStatus } from "http-status-codes";
import Controller from "./controller";

interface UserAuthControllerType {
  code: string;
  phoneNumber: string;
}
export interface Otp {
  code: string;
  expiresIn: number;
}

const CODE_EXPIRES = 90 * 1000;

class UserAuthController extends Controller implements UserAuthControllerType {
  phoneNumber: string;
  code: string;
  constructor() {
    super();
    this.phoneNumber = "";
    this.code = "0";
  }

  async getOtp(req: Request<{}, {}, { phoneNumber: string }>, res: Response<{
    statusCode: number,
    message?:string
    data?: {
      message: string,
      expiresIn: number,
      phoneNumber:string,
    },
  }>) {
    let { phoneNumber } = req.body;
    if (!phoneNumber) {
      throw createError.BadRequest("شماره موبایل رو وارد کنید !");
    }
    phoneNumber = phoneNumber.trim();
    this.phoneNumber = phoneNumber;
    this.code = String(generateRandomeNumber(6));

    const result = await this.authentication(phoneNumber);
    if (!result.affectedRows) {
      throw createError.Unauthorized("ورود شما با خطا مواجه شد !");
    }

    this.sendOtp(phoneNumber, res);
  }

  async authentication(phoneNumber: string): Promise<ResultAuthentication> {
    const otp: Otp = {
      code: this.code,
      expiresIn: Date.now() + CODE_EXPIRES,
    };
    return await UserAuthModel.authentication(phoneNumber, otp);
  }
  sendOtp(phoneNumber: string, res:Response<{
    statusCode: number,
    message?:string
    data?: {
      message: string,
      expiresIn: number,
      phoneNumber:string,
    },
  }>): void {
    const api = Kavenegar.KavenegarApi({
      apikey: `${process.env.KAVENEGAR_API_KEY}`,
    });
    api.VerifyLookup(
      {
        receptor: phoneNumber,
        token: this.code,
        token2: "90 ثانیه ",
        template: "registerVerify",
      },
      (response, status) => {
        console.log(response);
        console.log("kavenegar message status", status);
        if (response && status === 200)
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
              message: `کد تائید برای شماره موبایل ${toPersianDigits(
                phoneNumber
              )} ارسال گردید`,
              expiresIn: CODE_EXPIRES,
              phoneNumber,
            },
          });
        return res.status(status).send({
          statusCode: status,
          message: "کد اعتبارسنجی ارسال نشد",
        });
      }
    );
  }
}

export default new UserAuthController();
