import {
  ALREADY_VERIFIED,
  DUPLICATE_EMAIL,
  EXPIRED_RESET_PASSWORD,
  EXPIRED_VERIFICATION_CODE,
  INCORRECT_EMAIL_OR_PASSWORD,
  INCORRECT_VERIFICATION_CODE,
  NOT_VERIFIED_ACCOUNT,
  NO_USER_EMAIL,
} from "../constants/messages";
import {
  ActivateAccountDTO,
  LoginDto,
  RegisterUserDTO,
} from "../dtos/authDTOs";
import { VerificationType } from "../generalTypes";
import sendEmail from "../handlers/emailSendingHandler";
import uploadToImageKit from "../handlers/imageKitUploadHandler";
import { generateJWTToken } from "../handlers/jwtHandler";
import userRepository from "../repository/userRepository";
import { HttpError } from "../utils/commonTypes";
import bcrypt from "bcrypt";

async function register(
  user: RegisterUserDTO,
  userImageFile?: Express.Multer.File
) {
  const existingUser = await userRepository.findUserByEmail(user.email);
  if (existingUser) throw new HttpError(DUPLICATE_EMAIL, 400);

  if (userImageFile && userImageFile.fieldname === "profileImage") {
    const imageUrl = await uploadToImageKit(userImageFile, "user");
    user.profileImage = imageUrl;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  await userRepository.addUser(user);
  await sendVerificationCode(user.email, "account-activation");
}

async function sendVerificationCode(
  email: string,
  verificationType: VerificationType
) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new HttpError(NO_USER_EMAIL, 400);
  if (user.userVerified && verificationType === "account-activation")
    throw new HttpError(ALREADY_VERIFIED, 400);
  const verificationCode = Math.floor(Math.random() * 90000) + 10000;
  const otpExpireDate = new Date(Date.now() + 3 * 60000);
  await userRepository.updateOtpPass(email, verificationCode, otpExpireDate);
  await sendEmail(user.email, verificationType, verificationCode);
}

async function activateUser(input: ActivateAccountDTO) {
  const user = await userRepository.findUserByEmail(input.email);
  if (!user) throw new HttpError(NO_USER_EMAIL, 400);
  if (user.userVerified) throw new HttpError(ALREADY_VERIFIED, 400);
  checkOtp(input.otpPass, user.otpPass!, user.otpExpDate!);
  await userRepository.activateUser(input.email);
  const token = generateJWTToken(user.userId);
  return token;
}

async function verifyResetPassword(input: ActivateAccountDTO) {
  const user = await userRepository.findUserByEmail(input.email);
  if (!user) throw new HttpError(NO_USER_EMAIL, 400);
  checkOtp(input.otpPass, user.otpPass!, user.otpExpDate!);
  const passExpireDate = new Date(Date.now() + 10 * 60000);
  await userRepository.verifyResetPassword(input.email, passExpireDate);
}

async function resetPassword(input: LoginDto) {
  const user = await userRepository.findUserByEmail(input.email);
  if (!user) throw new HttpError(NO_USER_EMAIL, 400);
  const currentDate = new Date();
  if (currentDate.getTime() > user.passExpDate!.getTime())
    throw new HttpError(EXPIRED_RESET_PASSWORD, 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);
  await userRepository.resetPassword(input.email, hashedPassword);
}

async function login(input: LoginDto) {
  const user = await userRepository.findUserByEmail(input.email);
  const error = new HttpError(INCORRECT_EMAIL_OR_PASSWORD, 400);
  if (!user) throw error;
  if (!user.userVerified) throw new HttpError(NOT_VERIFIED_ACCOUNT, 400);
  const isValidPassword = await bcrypt.compare(input.password, user.password);
  if (!isValidPassword) throw error;
  const token = generateJWTToken(user.userId);
  return token;
}

function checkOtp(currentOtp: number, userOtp: number, userExpDate: Date) {
  if (currentOtp !== userOtp)
    throw new HttpError(INCORRECT_VERIFICATION_CODE, 400);
  const currentDate = new Date();
  if (currentDate.getTime() > userExpDate.getTime())
    throw new HttpError(EXPIRED_VERIFICATION_CODE, 400);
}

const authService = {
  register,
  sendVerificationCode,
  activateUser,
  verifyResetPassword,
  resetPassword,
  login,
};

export default authService;
