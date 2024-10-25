import  createError  from 'http-errors';
import { NextFunction, Request, Response } from "express-serve-static-core";
import UserAuthModel from '../../models/userAuth-model';
function authorize(...allowedRoles:("OWNER"|"ADMIN"|"FREELANCER"|"USER")[]) {
  return async function (req:Request, _res:Response, next:NextFunction) {
    try {
      const userId = req.user?.id;
      if(!userId) throw createError.Unauthorized("کاربری یافت نشد !");
      const userRoles = await UserAuthModel.getFullUserRolesInfo(userId);
      const accsess = userRoles.find(r=>allowedRoles.includes(r.title) )
      if (allowedRoles.length === 0 || accsess)
        return next();
      throw createError.Forbidden("شما به این قسمت دسترسی ندارید");
    } catch (error) {
      next(error);
    }
  };
}
export default authorize
