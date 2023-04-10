import { RequestHandler } from "express";
import tryRequest from "../utils/tryRequest";
import multer from "multer";
import { HttpError } from "../utils/commonTypes";
import { IMAGE_SIZE_LIMIT, MAX_FILES } from "../constants/messages";

export default function uploadImage(handler: RequestHandler) {
  return tryRequest((req, res, next) => {
    return new Promise((resolve, reject) => {
      handler(req, res, (error) => {
        const numberOfFiles = (req.files?.length ?? 0) as number;
        if (numberOfFiles > 6) return reject(new HttpError(MAX_FILES, 400));
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return reject(new HttpError(IMAGE_SIZE_LIMIT, 400));
          } else return reject(new HttpError(error.message, 400));
        } else return resolve(next());
      });
    });
  });
}
