import {
  ActivateAccountDTO,
  LoginDto,
  RegisterUserDTO,
} from "../dtos/authDTOs";
import Joi from "joi";

export function validateUserInfo(user: RegisterUserDTO) {
  return Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(4).max(20).required(),
    password: Joi.string().alphanum().min(5).max(30).required(),
  })
    .options({ abortEarly: false })
    .validate(user);
}

export function validateEmail(input: { email: string }) {
  return Joi.object({
    email: Joi.string().email().required(),
  }).validate(input);
}

export function validateEmailAndOTP(input: ActivateAccountDTO) {
  return Joi.object({
    email: Joi.string().email().required(),
    otpPass: Joi.number().integer().positive().required(),
  })
    .options({ abortEarly: false })
    .validate(input);
}

export function validateEmailAndPass(input: LoginDto) {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(5).max(30).required(),
  })
    .options({ abortEarly: false })
    .validate(input);
}
