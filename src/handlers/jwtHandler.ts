import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants/env";

export function generateJWTToken(userId: number) {
  const payload = { userId };
  const token = jwt.sign(payload, JWT_SECRET_KEY!);
  return token;
}
