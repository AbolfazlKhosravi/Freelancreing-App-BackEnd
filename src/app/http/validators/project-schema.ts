import Joi from "joi";

import createHttpError from "http-errors";

export const removeProject = Joi.object({
  id: Joi.string()
    .uuid()
    .error(createHttpError.BadRequest("شناسه پروژه ارسال شده معتبر نمی باشد")),
});