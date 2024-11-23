import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";
import ProposaleModel from "../../models/proposale-model";
import {
  RequestChangeProposalStatus,
  RequestGetListOfProposals,
  ResponseChangeProposalStatus,
  ResponseGetListOfProposals,
} from "../../router/proposal";
import Controller from "./controller";
import ProjectModel from "../../models/project-model";
import projectController from "./project-controller";

class ProposalController extends Controller {
  async changeProposalStatus(
    req: RequestChangeProposalStatus,
    res: ResponseChangeProposalStatus
  ) {
    const { id } = req.params;
    let { status, projectId } = req.body;

    if (![0, 1, 2].includes(status)) {
      throw createHttpError.BadRequest("وضعیت ارسال شده نامعتبر است");
    }

    if (status === 2) {
      const proposal = await ProposaleModel.findAcceptProposal(
        projectId,
        status
      );
      if (proposal.length) {
        throw createHttpError.BadRequest(
          "این پروژه قبلا به یک فریلنسر دیگه وارگزاری شده است !"
        );
      }
    }

    const resultChangeProposalStatus =
      await ProposaleModel.changeProposalStatus(Number(id), status);
    if (resultChangeProposalStatus.affectedRows === 0) {
      throw createHttpError.InternalServerError("وضعیت تغییر نکرد");
    }
    const project = await await projectController.findProjectById(projectId);

    const proposalArray = await ProposaleModel.findAcceptProposal(projectId, 2);
    let freelancerId: string | null = null;
    let statusProject = project.status;
    if (proposalArray.length) {
      const proposal = proposalArray[0];
      freelancerId = proposal.userId;
      statusProject = "CLOSED";
    }

    const result = await ProjectModel.AcceptFreelancer(
      projectId,
      freelancerId,
      statusProject
    );

    if (result.affectedRows === 0) {
      throw createHttpError.InternalServerError("برنامه به مشکل برخورد");
    }

    const messages = [
      "وضعیت پروپوزال به حالت رد شده تغییر یافت",
      "وضعیت پروپوزال به حالت در انتظار تایید تغییر یافت",
      "وضعیت پروپوزال تایید شد",
    ];

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: messages[status],
      },
    });
  }
  async getListOfProposals(
    req: RequestGetListOfProposals,
    res: ResponseGetListOfProposals
  ) {
    const user = req.user;
    if (!user) throw createHttpError.BadRequest("کاربری یافت نشد");

    const proposals = await ProposaleModel.getListOfUserProposals(user.id);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposals,
      },
    });
  }
}

export default new ProposalController();
