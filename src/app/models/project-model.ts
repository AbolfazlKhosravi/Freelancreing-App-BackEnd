import pool from "../../utils/mysql-database";
import { ProjectInfo } from "../router/project";
import { UserType } from "./userAuth-model";

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "CLOSED";
  budget: number;
  deadline: Date;
  owner: string;
  freelancer: string;
  updatedAt: Date;
  categoryId: number;
}
export interface ProjectsTags {
  id: number;
  type: string;
  project_id: string;
}
export interface CategoryType {
  id: number;
  title: string;
  englishTitle: string;
  description: string;
  type: string;
  parentId: number;
  icon_sm: string;
  icon_lg: string;
}
export interface Proposal {
  id: number;
  projectId: string;
  price: number;
  duration: number;
  description?: string;
  userId: string;
  userName: string;
  status: 0 | 1 | 2;
  createdAt: Date;
}
interface deleteProject {
  affectedRows: number;
}
type CereateProject = [
  [{ error_exist: 0 | 1 }],
  { affectedRows: number; insertId: number }
];
interface ChangeProjectStatus {
  changedRows: number;
}

class ProjectModel {
  static async getOwnerProjects(userId: string = "") {
    let query = "SELECT * FROM projects";

    if (userId) {
      query += ` WHERE owner = ?`;
    }

    const [result] = await pool.query(query, userId ? [userId] : []);

    return result as ProjectType[];
  }
  static async getDynamicProjectsTags(projectsId: string[] = []) {
    let query =
      "SELECT id,type,project_id FROM project_tags pt INNER JOIN tags t ON pt.tag_id = t.id ";

    if (projectsId.length) {
      const placeholders = projectsId.map(() => "?").join(",");
      query += ` WHERE project_id IN (${placeholders})`;
    }

    const [result] = await pool.query(query, projectsId);

    return result as ProjectsTags[];
  }
  static async getDynamicProjectsCategory(categoryId: number[] = []) {
    let query = "SELECT * FROM project_categories";
    if (categoryId.length) {
      const placeholders = categoryId.map(() => "?").join(",");
      query += ` WHERE id IN (${placeholders})`;
    }
    const [result] = await pool.query(query, categoryId);

    return result as CategoryType[];
  }
  static async getDynamicProjectsProposals(projectsId: string[] = []) {
    let query = "SELECT * FROM proposals";
    if (projectsId.length) {
      const placeholders = projectsId.map(() => "?").join(",");
      query += ` WHERE projectId IN (${placeholders})`;
    }
    const [result] = await pool.query(query, projectsId);

    return result as Proposal[];
  }
  static async getDynamicFreelancersProjects(freelancersId: string[]) {
    let query = "SELECT * FROM users";

    if (freelancersId.length) {
      const placeholders = freelancersId.map(() => "?").join(",");
      query += ` WHERE id IN (${placeholders})`;
    }
    const [result] = await pool.query(query, freelancersId);
    return result as UserType[];
  }
  static async getFullOwnerProjectsInfo(userId: string) {
    const ownerProjects = await ProjectModel.getOwnerProjects(userId);
    let freelancers: UserType[] = [];
    if (!ownerProjects.length) {
      return {
        ownerProjects: [],
        projectsTags: [],
        projectsCategories: [],
        freelancers,
      };
    }

    const projectsIds = ownerProjects.map((project) => project.id);
    const categoryId = ownerProjects.map((project) => project.categoryId);
    const freelancersId = ownerProjects
      .filter((project) => project.freelancer)
      .map((project) => project.freelancer);

    const [projectsTags, projectsCategories] = await Promise.all([
      ProjectModel.getDynamicProjectsTags(projectsIds),
      ProjectModel.getDynamicProjectsCategory(categoryId),
    ]);

    if (freelancersId.length) {
      freelancers = await ProjectModel.getDynamicFreelancersProjects(
        freelancersId
      );
    }

    return {
      ownerProjects,
      projectsTags,
      projectsCategories,
      freelancers,
    };
  }
  static async getProjectByid(id: string) {
    const [result] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [
      id,
    ]);

    return result as ProjectType[];
  }
  static async deleteProject(id: string) {
    const [result] = await pool.query(`DELETE FROM projects WHERE id = ?`, [
      id,
    ]);
    return result as deleteProject;
  }
  static async CreateProject(data: ProjectInfo, ownerId: string) {
    const { title, description, budget, deadline, category, tags } = data;

    const [result] = await pool.query(`CALL CreateProject(?,?,?,?,?,?,?)`, [
      title,
      description,
      budget,
      deadline.slice(0, 19).replace("T", " "),
      category,
      JSON.stringify(tags),
      ownerId,
    ]);

    const [queryResult] = result as CereateProject;
    return queryResult[0];
  }
  static async UpdateProject(data: ProjectInfo, id: string) {
    const { title, description, tags, deadline, budget, category } = data;

    const [result] = await pool.query(`CALL UpdateProject(?,?,?,?,?,?,?)`, [
      title,
      description,
      budget,
      deadline.slice(0, 19).replace("T", " "),
      category,
      JSON.stringify(tags),
      id,
    ]);

    const [queryResult] = result as CereateProject;
    return queryResult[0];
  }
  static async ChangeProjectStatus(id: string, status: "OPEN" | "CLOSED") {
    const [result] = await pool.query(
      `UPDATE projects SET status =? WHERE id =?`,
      [status, id]
    );

    return result as ChangeProjectStatus;
  }
  static async getProjectProposals(id: string) {
    const [result] = await pool.query(`SELECT p.*,u.name as userName FROM proposals as p INNER JOIN  users as u on p.userId=u.id where p.projectId=?`,[id]);
    return result as Proposal[];
  }
  static async AcceptFreelancer(projectId:string, freelancerId:string|null){
    const [result]=await pool.query(`UPDATE projects SET freelancer= ? WHERE id=?`,[freelancerId,projectId]);
    return result as deleteProject;
  }
}

export default ProjectModel;
