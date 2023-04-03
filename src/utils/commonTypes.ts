import { NextFunction, Request, Response } from "express";

export type Controller<ReqBody = any> = (
  req: Request<Record<string, string>, any, ReqBody>,
  res: Response
) => Promise<any>;

export type Middleware<ReqBody = any> = (
  req: Request<Record<string, string>, any, ReqBody>,
  res: Response,
  next: NextFunction
) => Promise<any>;

export class HttpError<T> extends Error {
  constructor(message: string, public statusCode: number, public data?: T) {
    super(message);
  }
}
