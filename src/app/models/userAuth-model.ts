import pool from "../../utils/mysql-database";
import { Otp } from "../http/controllers/userAuth-controller";

interface OtpDatabaseType {
  code: number;
  expiresIn: string;
}

interface UserRoles{
  role_id: number;
  user_id:string
}
interface FullUserRolesinfo{
  id: number;
  user_id:string
  title:"OWNER"|"ADMIN"|"FREELANCER"|"USER"
}
export interface ResultQueryUpdateOrInsert {
  affectedRows: number;
}
export type ResultCheckOtp =
  | {
      id: string;
      code: number;
      expiresIn: Date;
    }
  | [];

export interface UserType {
  id: string;
  name: string;
  avatar: string;
  biography: string;
  email: string;
  phoneNumber: string;
  password: string;
  resetLink: string;
  isVerifiedPhoneNumber: 0 | 1;
  isActive: 0 | 1;
  status: 0 | 1 | 2;
  createdAt: Date;
  updatedAt: Date;
}
export type ReturnQueryUserFullInfo = [
  user: UserType[],
  otp: {
    id: string;
    code: number;
    expiresIn: Date;
  }[],
  roles: {
    id: number;
    title: string;
    user_id: string;
  }[]
];
export interface UserFullInfo {
  user: UserType;
  otp: {
    id: string;
    code: number;
    expiresIn: Date;
  };
  roles: {
    id: number;
    title: string;
    user_id: string;
  }[];
}

class UserAuthModel {
  static async authentication(
    phoneNumber: String,
    otp: Otp
  ): Promise<ResultQueryUpdateOrInsert> {
    const otpDatabase: OtpDatabaseType = {
      code: Number(otp.code),
      expiresIn: new Date(otp.expiresIn)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
    };

    const [result] = await pool.query("CALL authentication(?,?)", [
      phoneNumber.trim(),
      JSON.stringify(otpDatabase),
    ]);
    return result as ResultQueryUpdateOrInsert;
  }

  static async findUserWithPhoneNumber(
    phoneNumber: string
  ): Promise<UserType[]> {
    const [result] = await pool.query(
      "SELECT * FROM users WHERE phoneNumber = ?",
      [phoneNumber.trim()]
    );
    return result as UserType[];
  }
  static async findUserWithId(id: string): Promise<UserType[]> {
    const [result] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return result as UserType[];
  }
  static async findUserWithEmail(email: string): Promise<UserType[]> {
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email.trim(),
    ]);
    return result as UserType[];
  }
  static async getRolesUser(userId:string){
    const [result]=await pool.query("SELECT * FROM user_roles WHERE user_id = ?",userId);

    return result as UserRoles[]
  }
  static async getFullUserRolesInfo(userId:string){
    const [result]=await pool.query("SELECT id,title,user_id FROM roles r INNER JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?",userId);

    return result as FullUserRolesinfo[]
  }
  static async checkOtp(id: string, code: number) {
    const dateIso = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await pool.query(
      "SELECT * FROM otp WHERE user_id = ? AND code = ? AND  expiresIn >= ?",
      [id, code, dateIso]
    );
    return result as ResultCheckOtp[];
  }
  static async updateisVerifiedPhoneNumber(id: string, data: number) {
    const [result] = await pool.query(
      "UPDATE users SET isVerifiedPhoneNumber=? WHERE id=? ",
      [data, id]
    );

    return result as ResultQueryUpdateOrInsert;
  }
  static async getFullUserInfo(id: string) {
    const [results] = await pool.query("CALL getUserInfo(?)", [id]);

    const returnQuery = results as ReturnQueryUserFullInfo;

    const userFullinfo = {
      user: returnQuery[0][0],
      otp: returnQuery[1][0],
      roles: returnQuery[2],
    };

    return userFullinfo;
  }
  static async updateUserAndGetFullInfo(
    id: string,
    name: string,
    email: string,
    role: number
  ) {
    const [results] = await pool.query(
      "CALL updateUserAndGetFullInfo(?,?,?,?)",
      [id, name.trim(), email.trim(), Number(role)]
    );

    const returnQuery = results as ReturnQueryUserFullInfo;

    const userFullinfo = {
      user: returnQuery[0][0],
      otp: returnQuery[1][0],
      roles: returnQuery[2],
    };

    return userFullinfo;
  }
}

export default UserAuthModel;
