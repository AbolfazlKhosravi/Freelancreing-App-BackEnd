import express from "express";
import "dotenv/config";
import pool from "../utils/mysql-database";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import allRoutes from "./router/router";
import { NextFunction, Request, Response } from "express-serve-static-core";
import createError, { HttpError } from "http-errors";

class Application {
  #app = express();
  #Port = process.env.APP_PORT || 5500;

  constructor() {
    this.createServer();
    this.connectToMYSQL();
    this.configServer();
    this.initClientSession();
    this.configRoutes();
    this.errorHandling();
  }

  createServer(): void {
    this.#app.listen(this.#Port, () => {
      console.log(
        "app in running on port " +
          this.#Port +
          " (env: " +
          process.env.NODE_ENV
      );
    });
  }
  async connectToMYSQL(): Promise<void> {
    try {
      const connection = await pool.getConnection();
      console.log("Connected to MySQL database!");
      connection.release();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Database connection error:", error);
      }
    }
  }
  configServer(): void {
    this.#app.use(
      cors({ credentials: true, origin: process.env.ALLOW_CORS_ORIGIN })
    );
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "..", "public")));
  }
  initClientSession(): void {
    this.#app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
  }
  configRoutes(): void {
    this.#app.use("/api", allRoutes);
  }

  errorHandling(): void {
    this.#app.use((_req: Request, _res: Response, next: NextFunction) => {
      next(createError.NotFound("ادرس مورد نظر یافت نشد"));
    });
    this.#app.use(
      (
        error: HttpError,
        _req: Request,
        res: Response<{ message: string; statusCode: number }>,
        _next: NextFunction
      ) => {
        const serverError: HttpError = createError.InternalServerError();
        const statusCode: number = error.status || serverError.status;
        const message: string = error.message || serverError.message;
        res.status(statusCode).json({
          statusCode,
          message,
        });
      }
    );
  }
}
export default Application;
