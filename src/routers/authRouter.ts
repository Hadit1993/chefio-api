import { ValidationError } from "joi";
import { Router, json } from "express";
import authController from "../controllers/authController";
import imageUpload from "../configs/imageUploadConfig";
import uploadImage from "../middlewares/imageUploadMiddleware";
import validationMiddleware from "../middlewares/inputValidationMiddleware";
import {
  validateEmailAndOTP,
  validateEmail,
  validateUserInfo,
  validateEmailAndPass,
} from "../validators/authValidator";

const authRouter = Router();

authRouter.post(
  "/signup/verification",
  validationMiddleware(validateEmail),
  authController.sendVerificationCodeForAccount
);

authRouter.post(
  "signup/activation-account",
  validationMiddleware(validateEmailAndOTP),
  authController.activateAccount
);

authRouter.post(
  "/signup",
  uploadImage(imageUpload.single("profileImage")),
  validationMiddleware(validateUserInfo),
  authController.signup
);

authRouter.post(
  "/reset-password/request",
  validateEmail,
  authController.requestResetPassword
);

authRouter.post(
  "/reset-password/verify",
  validateEmailAndOTP,
  authController.verifyResetPassword
);

authRouter.post(
  "/reset-password",
  validateEmailAndPass,
  authController.resetPassword
);

authRouter.post("login", validateEmailAndPass, authController.login);

export default authRouter;
