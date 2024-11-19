import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";
import {
  RequestAddNewProject,
  RequestChangeProjectStatus,
  RequestDeleteProject,
  RequestGetOwnerProjects,
  RequestUpdateProject,
  ResponseAddNewProject,
  ResponseChangeProjectStatus,
  ResponseDeleteProject,
  ResponseGetOwnerProjects,
  ResponseUpdateProject,
} from "../../router/project";
import Controller from "./controller";
import ProjectModel from "../../models/project-model";
import { addProjectSchema, removeProject } from "../validators/project-schema";

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
  async addNewProject(req: RequestAddNewProject, res: ResponseAddNewProject) {
    const userId = req?.user?.id;
    if (!userId) throw createHttpError.Unauthorized("کاربری یافت نشد!");
    await addProjectSchema.validateAsync(req.body);

    const result = await ProjectModel.CreateProject(req.body, userId);

    if (result?.error_exist)
      throw createHttpError.InternalServerError("پروژه ثبت نشد");

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پروژه با موفقیت ایجاد شد",
      },
    });
  }

  async updateProject(req: RequestUpdateProject, res: ResponseUpdateProject) {
    await addProjectSchema.validateAsync(req.body);
    const { id } = req.params;
    await this.findProjectById(id);

    const result = await ProjectModel.UpdateProject(req.body, id);

    if (result?.error_exist)
      throw createHttpError.InternalServerError("به روزرسانی انجام نشد");
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روز رسانی با موفقیت انجام شد",
      },
    });
  }

  async changeProjectStatus(
    req: RequestChangeProjectStatus,
    res: ResponseChangeProjectStatus
  ) {
    const { id } = req.params;
    const { status } = req.body;

    const result = await ProjectModel.ChangeProjectStatus(id, status);

    if (result.changedRows === 0) {
      throw createHttpError.InternalServerError(" وضعیت پروپوزال آپدیت نشد");
    }

    let message = "پروژه بسته شد";
    if (status === "OPEN") message = "وضعیت پروژه به حالت باز تغییر یافت";

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

export default new ProjectController();
