import Joi from "joi";

import createHttpError from "http-errors";

export const getOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
});

export const checkOtpSchema = Joi.object({
  otp: Joi.string()
    .min(5)
    .max(6)
    .error(createHttpError.BadRequest("کد ارسال شده صحیح نمیباشد")),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
});
