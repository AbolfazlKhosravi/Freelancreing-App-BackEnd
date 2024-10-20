import pool from "../../utils/mysql-database";
import { Otp } from "../http/controllers/userAuth-controller";

interface OtpDatabaseType {
  code: number;
  expiresIn: string;
}

export interface ResultQueryUpdateOrInsert {
  affectedRows: number;
}
export type ResultCheckOtp = {
  id: string;
  code: number;
  expiresIn: Date;
}|[];


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
  static async checkOtp(id: string, code: number) {
    const dateIso = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await pool.query(
      "SELECT * FROM otp WHERE user_id = ? AND code = ? AND  expiresIn >= ?",
      [id, code, dateIso]
    );
    return result as ResultCheckOtp[];
  }
  static async updateisVerifiedPhoneNumber(id:string,data:number){
  const [result]=await pool.query("UPDATE users SET isVerifiedPhoneNumber=? WHERE id=? ",[data,id]);

   return result as ResultQueryUpdateOrInsert

  }
}

export default UserAuthModel;
