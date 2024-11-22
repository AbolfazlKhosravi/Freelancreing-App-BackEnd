import pool from "../../utils/mysql-database";


interface ProposalBaseInfo {
    id: number;
    projectId: string;
    price: number;
    duration: number;
    userId: string;
    status: 0 | 1 | 2;
    createdAt: Date;
}

interface ResultChangeProposalStatus{
    affectedRows:number
}

class ProposaleModel {
  static async findAcceptProposal(projectId:string,status:0|1|2){
    const [result]=await pool.query(`SELECT * FROM proposals WHERE projectId=? AND status=?`,[projectId,status])
    return result as ProposalBaseInfo[]
  }
  static async changeProposalStatus(id:number,status:0|1|2){
    const [result]=await pool.query(`UPDATE proposals SET status=? WHERE id=?`,[status,id])
    return result as ResultChangeProposalStatus
  }
  static async getListOfProposals(projectId:string){
    const [result]=await pool.query(`SELECT * FROM proposals WHERE projectId=?`,[projectId])
    return result as ProposalBaseInfo[]
  }
}
export default ProposaleModel;