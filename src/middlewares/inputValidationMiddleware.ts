import { ValidationResult } from "joi";

import { Middleware, HttpError } from "../utils/commonTypes";
import transformJoiError from "../transformers/joiTransformer";

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
          transformJoiError(result.error)
        )
      );
    }
    console.log("validation result", result.error?.details);
    return next();
  };
}
