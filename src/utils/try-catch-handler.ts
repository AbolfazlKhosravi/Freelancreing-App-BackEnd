import createError, { HttpError } from "http-errors";
import { NextFunction } from "express-serve-static-core";
import logger from "./winston-logger";

type LoggerType = {
  message: string;
  stack?: string;
  url?: string;
};
export default function tryCatchHandler<Req, Res>(
  controller: (req: Req, res: Res) => Promise<void>
) {
  return async (req: Req, res: Res, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      if (error instanceof HttpError) {
        next(error);
        return;
      }
      if (error instanceof Error) {
        const value: LoggerType = {
          message: error.message,
          stack: error.stack,
        };
        if (req instanceof Request) {
          value.url = req.url;
        }
        logger.error(value);
        next(createError.ServiceUnavailable("مشکلی در  سرور  بوجود امده است"));
      }
    }
  };
}
