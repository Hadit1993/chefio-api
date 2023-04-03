import { ValidationError } from "joi";

export default function transformJoiErrror(error: ValidationError) {
  const messages = error.details.map((val) => ({ [val.path[0]]: val.message }));
  return messages.reduce((acc, curr) => Object.assign(acc, curr), {});
}
