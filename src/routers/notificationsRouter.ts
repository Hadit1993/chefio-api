import { Router } from "express";
import checkAuthMiddleware from "../middlewares/checkAuthMiddleware";
import notificationsController from "../controllers/notificationsController";
import validationMiddleware from "../middlewares/inputValidationMiddleware";
import { validatePagination } from "../validators/notificationsValidator";

const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  checkAuthMiddleware,
  validationMiddleware(validatePagination, "query"),
  notificationsController.getNotifications
);

export default notificationsRouter;
