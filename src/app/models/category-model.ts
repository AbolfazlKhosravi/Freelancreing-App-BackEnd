import QueryString from "qs";
import pool from "../../utils/mysql-database";
import { CategoryType } from "./project-model";

class CategoryModel {
  static async getCategoryList(queryString: QueryString.ParsedQs) {
    let query = "SELECT * FROM project_categories";
    if (queryString) {
      query += ` `;
    }
    const [result] = await pool.query(query);
    
    return result as CategoryType[];
  }
}
export default CategoryModel;
