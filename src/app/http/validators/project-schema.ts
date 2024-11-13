import Joi from "joi";

import createHttpError from "http-errors";

export const removeProject = Joi.object({
  id: Joi.string()
    .uuid()
    .error(createHttpError.BadRequest("شناسه پروژه ارسال شده معتبر نمی باشد")),
});

export const addProjectSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(30)
    .error(createHttpError.BadRequest("عنوان محصول صحیح نمیباشد")),
  description: Joi.string()
    .required()
    .error(createHttpError.BadRequest("توضیحات ارسال شده صحیح نمیباشد")),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createHttpError.BadRequest("برچسب ها نمیتواند بیشتر از 20 ایتم باشد")),
  category: Joi.number()
    .required()
    .error(createHttpError.BadRequest("دسته بندی مورد نظر  صحیح نمی باشد")),
  budget: Joi.number().error(
    createHttpError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),
  deadline: Joi.date()
    .required()
    .error(createHttpError.BadRequest("ددلاین پروژه را وارد کنید")),
});