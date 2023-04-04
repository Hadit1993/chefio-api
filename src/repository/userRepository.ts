import { RegisterUserDTO } from "../dtos/authDTOs";
import handleQuery from "../handlers/queryHandler";
import UserEntity from "../entities/userEntity";
import { snakeToCamel } from "../transformers/snakeToCamelTransformer";

async function findUserByEmail(email: string): Promise<UserEntity | undefined> {
  const result = (await handleQuery(
    "SELECT * FROM users WHERE email=?",
    email
  )) as any[];
  if (result.length === 0) return undefined;
  else return snakeToCamel(result[0]);
}

async function updateOtpPass(email: string, otpPass: number, otpExpDate: Date) {
  await handleQuery(
    "UPDATE users SET otp_pass = ?, otp_exp_date = ? WHERE email = ?",
    [otpPass, otpExpDate, email]
  );
}

async function activateUser(email: string) {
  await handleQuery("UPDATE users SET user_verified = ? WHERE email = ?", [
    1,
    email,
  ]);
}

async function verifyResetPassword(email: string, passExpDate: Date) {
  await handleQuery("UPDATE users SET pass_exp_date = ? WHERE email = ?", [
    passExpDate,
    email,
  ]);
}

async function resetPassword(email: string, password: string) {
  await handleQuery("UPDATE users SET password = ? WHERE email = ?", [
    password,
    email,
  ]);
}

async function addUser(user: RegisterUserDTO): Promise<void> {
  await handleQuery(
    "INSERT INTO users (email, username, password, profile_image) VALUES(?, ?, ?, ?)",
    [user.email, user.username, user.password, user.profileImage]
  );
}

const userRepository = {
  addUser,
  findUserByEmail,
  updateOtpPass,
  activateUser,
  verifyResetPassword,
  resetPassword,
};

export default userRepository;
