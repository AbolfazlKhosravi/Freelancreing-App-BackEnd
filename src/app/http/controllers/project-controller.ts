import HttpStatus from 'http-status-codes';
import createHttpError from "http-errors";
import { RequestGetOwnerProjects, ResponseGetOwnerProjects } from "../../router/project";
import Controller from "./controller";
import ProjectModel from '../../models/project-model';


class ProjectController extends Controller {
    constructor(){
      super();
    }

   async getListOfOwnerProjects(req:RequestGetOwnerProjects,res:ResponseGetOwnerProjects){

    const userId = req.user?.id;

    if(!userId) throw createHttpError.Unauthorized("کاربری یافت نشد !");

     const fullProjectsInfo= await ProjectModel.getFullOwnerProjectsInfo(userId)

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        fullProjectsInfo,
      },
    });
   }
}



export default new ProjectController()