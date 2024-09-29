import createError, { HttpError } from "http-errors";
import { NextFunction } from "express-serve-static-core";
export default function tryCatchHandler<Req, Res>(
  controller: (req: Req, res: Res) => Promise<void>
) {
  return async (req: Req, res: Res, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      if (error instanceof HttpError) {
        next(error);
      } else {
        next(
          createError.InternalServerError(
            "مشکلی در  سرور  بوجود امده است"
          )
        );
      }
    }
  };
}
