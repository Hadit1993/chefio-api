import { NextFunction, Request, Response } from "express";

import BaseResponse from "../dtos/BaseResponse";
import { HttpError } from "../utils/commonTypes";

export default function handleError(
  error: any,
  _: Request,
  res: Response,
  __: NextFunction
) {
  console.error(error);

  if (error instanceof HttpError) {
    return res
      .status(error.statusCode)
      .json(
        new BaseResponse(error.data, { success: false, message: error.message })
      );
  } else
    return res
      .status(500)
      .json(new BaseResponse(undefined, { success: false }));
}
