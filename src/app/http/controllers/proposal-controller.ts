import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";
import ProposaleModel from "../../models/proposale-model";
import {
  RequestChangeProposalStatus,
  ResponseChangeProposalStatus,
} from "../../router/proposal";
import Controller from "./controller";
import ProjectModel from "../../models/project-model";

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

    const proposalArray = await ProposaleModel.findAcceptProposal(projectId, 2);
    let freelancerId: string | null = null;
    if (proposalArray.length) {
      const proposal = proposalArray[0];
      freelancerId = proposal.userId;
    }

    const result = await ProjectModel.AcceptFreelancer(projectId, freelancerId);

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
}

export default new ProposalController();
