import { Router } from "express";
import validationMiddleware from "../middlewares/inputValidationMiddleware";
import { validateRecipe } from "../validators/recipesValidator";
import recipesController from "../controllers/recipesController";

const recipesRouter = Router();

recipesRouter
  .route("/")
  .post(validationMiddleware(validateRecipe), recipesController.addRecipe)
  .get();

export default recipesRouter;
