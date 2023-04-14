import { Router } from "express";
import validationMiddleware from "../middlewares/inputValidationMiddleware";
import {
  validateRecipe,
  validateRecipeFilters,
  validateRecipeId,
} from "../validators/recipesValidator";
import recipesController from "../controllers/recipesController";
import uploadImage from "../middlewares/imageUploadMiddleware";
import imageUpload from "../configs/imageUploadConfig";
import objectNormalizationMiddlware from "../middlewares/objectNormalizationMiddleware";
import checkAuthMiddleware from "../middlewares/checkAuthMiddleware";
import recipeImageFieldValidationMiddlewaer from "../middlewares/recipeImageFieldValidationMiddleware";

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
    validationMiddleware(validateRecipeFilters, "query"),
    recipesController.findAllRecipes
  );

recipesRouter.get(
  "/me",
  checkAuthMiddleware,
  recipesController.findUserRecipes
);

recipesRouter.post(
  "/:recipeId/like",
  checkAuthMiddleware,
  validationMiddleware(validateRecipeId, "params"),
  recipesController.likeRecipe
);

recipesRouter.post(
  "/:recipeId/unlike",
  checkAuthMiddleware,
  validationMiddleware(validateRecipeId, "params"),
  recipesController.unlikeRecipe
);

recipesRouter.get(
  "/:recipeId",
  validationMiddleware(validateRecipeId, "params"),
  recipesController.findRecipeById
);

export default recipesRouter;
