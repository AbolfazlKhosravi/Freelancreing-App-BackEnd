import express from "express";
import constants from "../../utils/constants";
import authorize from "../http/middlewares/permission.guard";
import tryCatchHandler from "../../utils/try-catch-handler";
import { Request, Response } from "express-serve-static-core";
import proposalController from "../http/controllers/proposal-controller";

const router = express.Router();
const { ROLES } = constants;

export type RequestChangeProposalStatus = Request<
  { id: string },
  {},
  {
    projectId: string;
    status: 0 | 1 | 2;
  }
>;
export type ResponseChangeProposalStatus = Response<{
  statusCode: number;
  data: {
    message: string;
  };
}>;

router.patch(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.USER),
  tryCatchHandler<RequestChangeProposalStatus,ResponseChangeProposalStatus>(proposalController.changeProposalStatus)
);

export default router;
