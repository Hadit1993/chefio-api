import { RequestHandler } from "express";
import tryRequest from "../utils/tryRequest";
import multer from "multer";
import { HttpError } from "../utils/commonTypes";
import { IMAGE_SIZE_LIMIT } from "../constants/messages";

export default function uploadImage(handler: RequestHandler) {
  return tryRequest((req, res, next) => {
    return new Promise((resolve, reject) => {
      handler(req, res, (error) => {
        if (error instanceof multer.MulterError) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return reject(new HttpError(IMAGE_SIZE_LIMIT, 400));
          } else return reject(new HttpError(error.message, 400));
        } else return resolve(next());
      });
    });
  });
}
