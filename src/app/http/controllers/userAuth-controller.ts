import createError from "http-errors";
import {
  generateRandomeNumber,
  setAccessToken,
  setRefreshToken,
  toPersianDigits,
} from "../../../utils/functions";
import UserAuthModel, {
  ResultQueryUpdateOrInsert,
} from "../../models/userAuth-model";
import Kavenegar from "kavenegar";
import "dotenv/config";
import { StatusCodes as HttpStatus } from "http-status-codes";
import Controller from "./controller";
import {
  RequestCheckOtp,
  RequestGetOtp,
  ResponseCheckOtp,
  ResponseGetOtp,
} from "../../router/userAuth";
import { checkOtpSchema, getOtpSchema } from "../validators/user-schema";

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

  async getOtp(req: RequestGetOtp, res: ResponseGetOtp) {
    await getOtpSchema.validateAsync(req.body);
    let { phoneNumber } = req.body;
    if (!phoneNumber) {
      throw createError.BadRequest("شماره موبایل رو وارد کنید !");
    }
    phoneNumber = phoneNumber.trim();
    this.phoneNumber = phoneNumber;
    this.code = String(generateRandomeNumber(6));

    const result = await this.authentication(phoneNumber);
    if (result.affectedRows === 0) {
      throw createError.Unauthorized("ورود شما با خطا مواجه شد !");
    }

    this.sendOtp(phoneNumber, res);
  }

  async authentication(
    phoneNumber: string
  ): Promise<ResultQueryUpdateOrInsert> {
    const otp: Otp = {
      code: this.code,
      expiresIn: Date.now() + CODE_EXPIRES,
    };
    return await UserAuthModel.authentication(phoneNumber, otp);
  }
  sendOtp(phoneNumber: string, res: ResponseGetOtp): void {
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

  async checkOtp(req: RequestCheckOtp, res: ResponseCheckOtp) {
    await checkOtpSchema.validateAsync(req.body);
    const { otp: code, phoneNumber } = req.body;
    const userArry = await UserAuthModel.findUserWithPhoneNumber(phoneNumber);
    if (userArry.length === 0) {
      throw createError.NotFound("کاربری با این شماره موبایل یافت نشد!");
    }

    const user = userArry[0];

    const dataOtp = await UserAuthModel.checkOtp(user.id, code);

    if (dataOtp.length === 0) {
      throw createError.BadRequest("کد  ارسال شده معتبر نیست  !");
    }

    const result = await UserAuthModel.updateisVerifiedPhoneNumber(user.id, 1);
   
    if (result.affectedRows === 0) {
      throw createError.InternalServerError("ورود شما با خطا مواجه شد!");
    }
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `کد تایید شد، خوش آمدید`;
    if (!user.isActive)
      WELLCOME_MESSAGE = `کد تایید شد، لطفا اطلاعات خود را تکمیل کنید`;

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });
  }
}

export default new UserAuthController();
