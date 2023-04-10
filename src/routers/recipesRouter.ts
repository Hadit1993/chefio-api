import { Router } from "express";
import validationMiddleware from "../middlewares/inputValidationMiddleware";
import {
  validateRecipe,
  validateRecipeFilters,
} from "../validators/recipesValidator";
import recipesController from "../controllers/recipesController";
import uploadImage from "../middlewares/imageUploadMiddleware";
import imageUpload from "../configs/imageUploadConfig";
import objectNormalizationMiddlware from "../middlewares/objectNormalizationMiddleware";
import checkAuthMiddleware from "../middlewares/checkAuthMiddleware";
import recipeImageFieldValidationMiddlewaer from "../middlewares/recipeImageFieldValidationMiddleware";
import queryParamsValidationMiddleware from "../middlewares/queryParamsValidationMiddleware";

const recipesRouter = Router();

recipesRouter
  .route("/")
  .post(
    checkAuthMiddleware,
    uploadImage(imageUpload.any()),
    recipeImageFieldValidationMiddlewaer,
    objectNormalizationMiddlware,
    validationMiddleware(validateRecipe),
    recipesController.addRecipe
  )
  .get(
    queryParamsValidationMiddleware(validateRecipeFilters),
    recipesController.findAllRecipes
  );

recipesRouter.get("/:id", recipesController.findRecipeById);

export default recipesRouter;
