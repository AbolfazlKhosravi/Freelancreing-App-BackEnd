import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";
import {
  RequestDeleteProject,
  RequestGetOwnerProjects,
  ResponseDeleteProject,
  ResponseGetOwnerProjects,
} from "../../router/project";
import Controller from "./controller";
import ProjectModel from "../../models/project-model";
import { removeProject } from "../validators/project-schema";

class ProjectController extends Controller {
  constructor() {
    super();
  }

  async getListOfOwnerProjects(
    req: RequestGetOwnerProjects,
    res: ResponseGetOwnerProjects
  ) {
    const userId = req.user?.id;

    if (!userId) throw createHttpError.Unauthorized("کاربری یافت نشد !");

    const fullProjectsInfo = await ProjectModel.getFullOwnerProjectsInfo(
      userId
    );

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        fullProjectsInfo,
      },
    });
  }

  async findProjectById(id: string) {
    const arrayParoject = await ProjectModel.getProjectByid(id);
    if (!arrayParoject.length)
      throw createHttpError.NotFound("پروژه یافت نشد.");
    return arrayParoject[0];
  }

  async deleteProject(req: RequestDeleteProject, res: ResponseDeleteProject) {
    await removeProject.validateAsync(req.body);
    const { id } = req.params;
    const project = await this.findProjectById(id);

    if (project.freelancer) {
      throw createHttpError.BadRequest("پروژه قابل حذف نیست");
    }
    const result = await ProjectModel.deleteProject(id);
    if (result.affectedRows === 0)
      throw createHttpError.InternalServerError("پروژه حذف نشد ");

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: `پروژه (${project.title}) با موفقیت حذف شد`,
      },
    });
  }
}

export default new ProjectController();
