import pool from "../../utils/mysql-database";

export interface ProposalBaseInfo {
  id: number;
  projectId: string;
  price: number;
  duration: number;
  userId: string;
  status: 0 | 1 | 2;
  createdAt: Date;
}

interface ResultChangeProposalStatus {
  affectedRows: number;
}
interface AddProposals {
  insertId: number;
}

class ProposaleModel {
  static async findAcceptProposal(projectId: string, status: 0 | 1 | 2) {
    const [result] = await pool.query(
      `SELECT * FROM proposals WHERE projectId=? AND status=?`,
      [projectId, status]
    );
    return result as ProposalBaseInfo[];
  }
  static async changeProposalStatus(id: number, status: 0 | 1 | 2) {
    const [result] = await pool.query(
      `UPDATE proposals SET status=? WHERE id=?`,
      [status, id]
    );
    return result as ResultChangeProposalStatus;
  }
  static async getListOfProposals(projectId: string) {
    const [result] = await pool.query(
      `SELECT * FROM proposals WHERE projectId=?`,
      [projectId]
    );
    return result as ProposalBaseInfo[];
  }
  static async getListOfUserProposals(userId: string) {
    const [result] = await pool.query(
      `SELECT * FROM proposals WHERE userId=?`,
      [userId]
    );
    return result as ProposalBaseInfo[];
  }
  static async addProposals(
    description: string,
    price: number,
    duration: number,
    projectId: string,
    userId: string
  ) {
    const [result] = await pool.query(
      `INSERT INTO proposals (description,price,duration,projectId,userId) VALUES (?,?,?,?,?)`,
      [description, price, duration, projectId, userId]
    );
    console.log(result);

    return result as AddProposals;
  }
}
export default ProposaleModel;
