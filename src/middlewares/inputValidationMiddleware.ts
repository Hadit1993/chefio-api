import { ValidationResult } from "joi";

import { Middleware, HttpError } from "../utils/commonTypes";
import transformJoiErrror from "../transformers/joiTransformer";

export default function validationMiddleware<T>(
  validator: (reqBody: T) => ValidationResult
): Middleware<T> {
  return async (req, _, next) => {
    const result = validator(req.body);
    if (result.error) {
      next(
        new HttpError(
          "some inputs are invalid",
          422,
          transformJoiErrror(result.error)
        )
      );
    }

    return next();
  };
}
