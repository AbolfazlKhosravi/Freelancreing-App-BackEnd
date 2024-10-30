import  express  from 'express';
import tryCatchHandler from '../../utils/try-catch-handler';
import { Request, Response } from "express-serve-static-core";
import { CategoryType } from '../models/project-model';
import categoryController from '../http/controllers/category-controller';

const router = express.Router();
export type RequestGetListOfCategories=Request
export type ResponseGetListOfCategories=Response<{
  statusCode: number;
  data: {
    categories: CategoryType[]
  };
}>


router.get(
  "/list",
  tryCatchHandler<RequestGetListOfCategories,ResponseGetListOfCategories>(categoryController.getListOfCategories)
);

export default router
