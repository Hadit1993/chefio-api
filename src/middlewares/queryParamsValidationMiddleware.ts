import { ValidationResult } from "joi";
import transformJoiError from "../transformers/joiTransformer";
import { Middleware, HttpError } from "../utils/commonTypes";

export default function queryParamsValidationMiddleware(
  validator: (queryParams: any) => ValidationResult
): Middleware {
  return async (req, _, next) => {
    const result = validator(req.query);

    if (result.error) {
      next(
        new HttpError(
          "some query params are invalid",
          422,
          transformJoiError(result.error)
        )
      );
    }
    return next();
  };
}
