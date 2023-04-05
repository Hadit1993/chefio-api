import { Router } from "express";
import validationMiddleware from "../middlewares/inputValidationMiddleware";
import { validateIngredientName } from "../validators/ingredientsValidator";
import ingredientsController from "../controllers/ingredientsController";
import checkAuthMiddleware from "../middlewares/checkAuthMiddleware";

const ingredientsRouter = Router();
ingredientsRouter.use(checkAuthMiddleware);

ingredientsRouter
  .route("/")
  .post(
    validationMiddleware(validateIngredientName),
    ingredientsController.addIngredient
  )
  .get(ingredientsController.getAllIngredients);

export default ingredientsRouter;
