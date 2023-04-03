import { Controller, Middleware } from "./commonTypes";

export default function tryRequest<ReqBody = any>(
  controller: Middleware<ReqBody>
): Middleware<ReqBody> {
  return async (req, res, next) => {
    try {
      return await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}
