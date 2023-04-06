import { ValidationError } from "joi";

export default function transformJoiError(error: ValidationError) {
  const messages = error.details.map((val) => ({
    [val.path.length === 1 ? val.path[0] : val.path.join("/")]: val.message,
  }));
  return messages.reduce((acc, curr) => Object.assign(acc, curr), {});
}
