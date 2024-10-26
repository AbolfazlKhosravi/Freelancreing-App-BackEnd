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

export type RequestDeleteProject = Request<{ id: string }>;
export type ResponseDeleteProject = Response<{
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

export default router;
