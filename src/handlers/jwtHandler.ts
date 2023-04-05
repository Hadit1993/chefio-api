import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants/env";
import { promises } from "nodemailer/lib/xoauth2";
import { HttpError } from "../utils/commonTypes";

export function generateJWTToken(userId: number) {
  const payload = { userId };
  const token = jwt.sign(payload, JWT_SECRET_KEY!);
  return token;
}

export function verifyJWTToken(token: string): Promise<number> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY!, (error, payload) => {
      if (error) return reject(error);
      const user = payload as { userId: number };
      return resolve(user.userId);
    });
  });
}
