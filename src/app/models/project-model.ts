import pool from "../../utils/mysql-database";
import { UserType } from "./userAuth-model";

export interface ProjectType {
  id: number;
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
  project_id: number;
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
export interface ProposalType {
  id: number;
  projectId: number;
  price: number;
  duration: number;
  userId: string;
  status: 0 | 1 | 2;
  createdAt: Date;
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
  static async getDynamicProjectsTags(projectsId: number[] = []) {
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
  static async getDynamicProjectsProposals(projectsId: number[] = []) {
    let query = "SELECT * FROM proposals";
    if (projectsId.length) {
      const placeholders = projectsId.map(() => "?").join(",");
      query += ` WHERE projectId IN (${placeholders})`;
    }
    const [result] = await pool.query(query, projectsId);

    return result as ProposalType[];
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
}

export default ProjectModel;
