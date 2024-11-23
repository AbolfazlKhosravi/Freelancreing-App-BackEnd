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
  Proposal,
} from "../models/project-model";
import { UserType } from "../models/userAuth-model";

const router = express.Router();
const { ROLES } = constants;

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

export type ResponseBasicOwnerProjectsInfo=Response<{
  statusCode: number;
  data: {
    basicProjectsInfo: {
      ownerProjects: ProjectType[];
      proposalsCount:number,
    };
  };
}>
router.get(
  "/owner-projects",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestGetOwnerProjects, ResponseGetOwnerProjects>(
    ProjectController.getListOfOwnerProjects
  )
);

router.get(
  "/owner-projects-basic-info",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestGetOwnerProjects, ResponseBasicOwnerProjectsInfo>(
    ProjectController.getBasicOwnerProjectsInfo
  )
);

// DELETE_OWNER_PROJECT_TYPE
export type RequestDeleteProject = Request<{ id: string }>;
export type ResponseDeleteProject = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

router.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestDeleteProject, ResponseDeleteProject>(
    ProjectController.deleteProject
  )
);

// CREATE_OWNER_PROJECT_TYPE
export interface ProjectInfo {
  title: string;
  description: string;
  category: number;
  budget: number;
  deadline: string;
  tags: string[];
}
export type RequestAddNewProject = Request<{}, {}, ProjectInfo>;
export type ResponseAddNewProject = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;
router.post(
  "/add",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestAddNewProject, ResponseAddNewProject>(
    ProjectController.addNewProject
  )
);

// update project
export type RequestUpdateProject = Request<{ id: string }, {}, ProjectInfo>;
export type ResponseUpdateProject = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

router.patch(
  "/update/:id",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestUpdateProject, ResponseUpdateProject>(
    ProjectController.updateProject
  )
);

// Change status of project

export type RequestChangeProjectStatus = Request<
  { id: string },
  {},
  { status: "OPEN" | "CLOSED" }
>;
export type ResponseChangeProjectStatus = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

router.patch(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<RequestChangeProjectStatus, ResponseChangeProjectStatus>(
    ProjectController.changeProjectStatus
  )
);

// get ProjectById And Proposals

export type RequestGetProjectByIdAndProposals = Request<{ id: string }>;
export type ResponseGetProjectByIdAndProposals = Response<{
  statusCode: number;
  data: {
    projectInfoAndProposals: {
      projectInfo: ProjectType;
      proposalList: Proposal[];
    };
  };
}>;

router.get(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.OWNER),
  tryCatchHandler<
    RequestGetProjectByIdAndProposals,
    ResponseGetProjectByIdAndProposals
  >(ProjectController.getProjectByIdAndProposals)
);

export default router;
