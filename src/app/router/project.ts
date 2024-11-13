import express from "express";
import constants from "../../utils/constants";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import authorize from "../http/middlewares/permission.guard";
import ProjectController from "../http/controllers/project-controller";
import {
  CategoryType,
  ProjectsTags,
  ProjectType,
} from "../models/project-model";
import { UserType } from "../models/userAuth-model";

// GET_OENER_PROJECTS_TYPE
export type RequestGetOwnerProjects = Request;
export type ResponseGetOwnerProjects = Response<{
  statusCode: number;
  data: {
    fullProjectsInfo: {
      ownerProjects: ProjectType[];
      projectsTags: ProjectsTags[];
      projectsCategories: CategoryType[];
      freelancers: UserType[];
    };
  };
}>;
// DELETE_OWNER_PROJECT_TYPE
export type RequestDeleteProject = Request<{ id: string }>;
export type ResponseDeleteProject = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

// CREATE_OWNER_PROJECT_TYPE
export interface ProjectInfo {
  title: string;
  description: string;
  category: number;
  budget: number;
  deadline: string;
  tags: string[];
}
export type RequestAddNewProject = Request<{},{},ProjectInfo>;
export type ResponseAddNewProject = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

const router = express.Router();
const { ROLES } = constants;

router.get(
  "/owner-projects",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestGetOwnerProjects, ResponseGetOwnerProjects>(
    ProjectController.getListOfOwnerProjects
  )
);

router.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestDeleteProject, ResponseDeleteProject>(
    ProjectController.deleteProject
  )
);

router.post(
  "/add",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestAddNewProject,ResponseAddNewProject>(ProjectController.addNewProject)
);

export default router;
