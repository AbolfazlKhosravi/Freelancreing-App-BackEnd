import pool from "../../utils/mysql-database";
import { Otp } from "../http/controllers/userAuth-controller";

interface OtpDatabaseType {
  code: number;
  expiresIn: string;
}

export interface ResultAuthentication {
  affectedRows: number;
}

class UserAuthModel {
  static authentication = async (
    phoneNumber: String,
    otp: Otp
  ): Promise<ResultAuthentication> => {
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
    console.log(result);
    

    return result as ResultAuthentication;
  };
}

export default UserAuthModel;
