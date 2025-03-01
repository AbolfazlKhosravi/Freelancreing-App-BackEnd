import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";
import {
  RequestAddNewProject,
  RequestChangeProjectStatus,
  RequestDeleteProject,
  RequestGetListOfProjects,
  RequestGetOwnerProjects,
  RequestGetProjectByIdAndProposals,
  RequestUpdateProject,
  ResponseAddNewProject,
  ResponseBasicOwnerProjectsInfo,
  ResponseChangeProjectStatus,
  ResponseDeleteProject,
  ResponseGetListOfProjects,
  ResponseGetOwnerProjects,
  ResponseGetProjectByIdAndProposals,
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
  async getBasicOwnerProjectsInfo(
    req: RequestGetOwnerProjects,
    res: ResponseBasicOwnerProjectsInfo
  ) {
    const userId = req.user?.id;

    if (!userId) throw createHttpError.Unauthorized("کاربری یافت نشد !");

    const basicProjectsInfo = await ProjectModel.getBasicOwnerProjectsInfo(
      userId
    );

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        basicProjectsInfo,
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

    const project=await this.findProjectById(id);
    if(project.freelancer&&status==="OPEN"){
      throw createHttpError.BadRequest("برای این پروژه درخواستی قبول شده امکان  باز کردن ان نیست !")
    }

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
  async getProjectByIdAndProposals(
    req: RequestGetProjectByIdAndProposals,
    res: ResponseGetProjectByIdAndProposals
  ) {
    const { id } = req.params;
    const projectInfo = await this.findProjectById(id);
    const projectProposals = await ProjectModel.getProjectProposals(id);
    const projectInfoAndProposals = {
      projectInfo,
      proposalList: projectProposals,
    };
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projectInfoAndProposals,
      },
    });
  }
  async getListOfProjects(_req:RequestGetListOfProjects, res:ResponseGetListOfProjects) {
  
  const projects=await ProjectModel.getOwnerProjects()

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects,
      },
    });
  }
}

export default new ProjectController();
