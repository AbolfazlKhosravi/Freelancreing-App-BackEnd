import HttpStatus  from 'http-status-codes';
import createHttpError from "http-errors";
import { RequestGetListOfCategories, ResponseGetListOfCategories } from "../../router/category";
import Controller from './controller';
import CategoryModel from '../../models/category-model';

class CategoryController extends Controller {
    async getListOfCategories(req:RequestGetListOfCategories, res:ResponseGetListOfCategories) {
      const query = req.query;
      
      const categories = await CategoryModel.getCategoryList(query);
      if (!categories)
        throw createHttpError.BadRequest("دسته بندی ها یافت نشد");
  
       res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          categories,
        },
      });
    }
}

export default new CategoryController();