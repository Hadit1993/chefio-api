import tryRequest from "../utils/tryRequest";
import {
  ActivateAccountDTO,
  LoginDto,
  RegisterUserDTO,
} from "../dtos/authDTOs";
import authService from "../services/authService";
import BaseResponse from "../dtos/BaseResponse";
import {
  SUCCESSFUL_ACTIVATION,
  SUCCESSFUL_REGISTER,
  SUCCESSFUL_RESET_PASSWORD,
  VERIFICATION_CODE_SENT,
} from "../constants/messages";

const signup = tryRequest<RegisterUserDTO>(async (req, res, _) => {
  await authService.register(req.body);
  res
    .status(201)
    .json(new BaseResponse(undefined, { message: SUCCESSFUL_REGISTER }));
});

const sendVerificationCodeForAccount = tryRequest<{ email: string }>(
  async (req, res, _) => {
    await authService.sendVerificationCode(
      req.body.email,
      "account-activation"
    );
    res.status(200).json(
      new BaseResponse(undefined, {
        message: VERIFICATION_CODE_SENT,
      })
    );
  }
);

const activateAccount = tryRequest<ActivateAccountDTO>(async (req, res, _) => {
  const jwtToken = await authService.activateUser(req.body);
  res.json(new BaseResponse(jwtToken, { message: SUCCESSFUL_ACTIVATION }));
});

const requestResetPassword = tryRequest<{ email: string }>(
  async (req, res, _) => {
    await authService.sendVerificationCode(req.body.email, "password-recovery");
    res.status(200).json(new BaseResponse());
  }
);

const verifyResetPassword = tryRequest<ActivateAccountDTO>(
  async (req, res, _) => {
    await authService.verifyResetPassword(req.body);
    res.status(200).json(new BaseResponse());
  }
);

const resetPassword = tryRequest<LoginDto>(async (req, res, next) => {
  await authService.resetPassword(req.body);
  res
    .status(200)
    .json(new BaseResponse(undefined, { message: SUCCESSFUL_RESET_PASSWORD }));
});

const login = tryRequest<LoginDto>(async (req, res, next) => {
  const jwtToken = await authService.login(req.body);
  res.json(new BaseResponse(jwtToken));
});

const authController = {
  signup,
  sendVerificationCodeForAccount,
  activateAccount,
  requestResetPassword,
  verifyResetPassword,
  resetPassword,
  login,
};
export default authController;
