import Joi from "joi";

import createError from "http-errors";

const addProposalSchema = Joi.object({
  description: Joi.string()
    .required()
    .error(createError.BadRequest("توضیحات ارسال شده صحیح نمیباشد")),
  price: Joi.number().error(
    createError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),
  duration: Joi.number()
    .required()
    .error(createError.BadRequest(" زمان انجام پروژه را وارد کنید")),
  projectId: Joi.string()
    .required()
});

export default addProposalSchema
