import { ValidationResult } from "joi";

import { Middleware, HttpError } from "../utils/commonTypes";
import transformJoiError from "../transformers/joiTransformer";
type InputType = "body" | "query" | "params";

export default function validationMiddleware<T>(
  validator: (reqBody: T) => ValidationResult,
  inputType: InputType = "body"
): Middleware {
  return async (req, _, next) => {
    const result = validator(req[inputType]);
    if (result.error) {
      next(
        new HttpError(
          "some inputs are invalid",
          422,
          transformJoiError(result.error)
        )
      );
    }
    return next();
  };
}
