import { INVALID_AUTHENTICATION } from "../constants/messages";
import BaseResponse from "../dtos/BaseResponse";
import { verifyJWTToken } from "../handlers/jwtHandler";
import { Middleware } from "../utils/commonTypes";

const checkAuthMiddleware: Middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) throw new Error();
    const userId = await verifyJWTToken(token);
    req.userId = userId;
    return next();
  } catch (error) {
    const response = new BaseResponse(undefined, {
      success: false,
      message: INVALID_AUTHENTICATION,
    });
    return res.status(401).json(response);
  }
};

export default checkAuthMiddleware;
