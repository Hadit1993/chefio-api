import Joi from "joi";
import { Paginate } from "../generalTypes";

export function validatePagination(paginate: Paginate) {
  return Joi.object({
    page: Joi.number().integer().positive().min(1),
    limit: Joi.number().integer().positive().min(10),
  })
    .options({ abortEarly: false })
    .validate(paginate);
}
