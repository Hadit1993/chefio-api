import { Request } from "express";
import multer from "multer";
import { HttpError } from "../utils/commonTypes";
import { JUST_IMAGE_ALLOWED } from "../constants/messages";

const imageFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.(JPG|jpg|jpeg|png)$/)) {
    return cb(new HttpError(JUST_IMAGE_ALLOWED, 400));
  } else return cb(null, true);
};

const imageUpload = multer({
  fileFilter: imageFilter,
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 600 * 1024,
  },
});

export default imageUpload;
