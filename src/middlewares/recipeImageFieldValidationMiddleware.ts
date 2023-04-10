import { INVALID_FILE_FIELD } from "../constants/messages";
import BaseResponse from "../dtos/BaseResponse";
import { Middleware } from "../utils/commonTypes";

const recipeImageFieldValidationMiddlewaer: Middleware = async (
  req,
  res,
  next
) => {
  const fieldNamePattern = /^recipeCoverImage$|^step\d+Image$/;

  for (const file of req.files as Express.Multer.File[]) {
    if (!fieldNamePattern.test(file.fieldname)) {
      return res
        .status(400)
        .json(
          new BaseResponse(undefined, {
            success: false,
            message: INVALID_FILE_FIELD,
          })
        );
    }
  }

  return next();
};

export default recipeImageFieldValidationMiddlewaer;
