import {
  NO_RECIPE_FOUND,
  RECIPE_ALREADY_LIKED,
  REQUIRED_RECIPE_IMAGE,
} from "../constants/messages";
import { LikeDTO } from "../dtos/likeDto";
import {
  CreateRecipeDTO,
  RecipeFilterDTO,
  RecipeIngredientDTO,
  RecipeResultDTO,
  RecipeStepDTO,
} from "../dtos/recipeDTOS";
import uploadToImageKit from "../handlers/imageKitUploadHandler";
import recipesRepository from "../repository/recipesRepository";
import { HttpError } from "../utils/commonTypes";
import ingredientsService from "./ingredientsService";

async function addRecipe(
  recipe: CreateRecipeDTO,
  recipeFiles: Express.Multer.File[]
) {
  const recipeCoverImage = recipeFiles.find(
    (file) => file.fieldname === "recipeCoverImage"
  );
  if (!recipeCoverImage)
    throw new HttpError("Some inputs are missing or invalid.", 400, {
      recipeCoverImage: REQUIRED_RECIPE_IMAGE,
    });

  const recipeCoverImageUrl = await uploadToImageKit(
    recipeCoverImage,
    "recipe"
  );
  recipe.recipeCoverImage = recipeCoverImageUrl;
  const recipeId = await recipesRepository.addRecipe(recipe);

  for (const ingredient of recipe.ingredients) {
    await addRecipeIngredient(ingredient, recipeId);
  }

  for (const step of recipe.steps) {
    await addRecipeStep(step, recipeFiles, recipeId);
  }
}

async function addRecipeIngredient(
  ingredient: RecipeIngredientDTO,
  recipeId: number
) {
  let ingredientId: number;
  if (ingredient.ingredientName) {
    ingredientId = await ingredientsService.findOrCreateIngredient(
      ingredient.ingredientName
    );
  } else {
    ingredientId = ingredient.ingredientId!;
  }
  await recipesRepository.addRecipeIngredient({
    ingredientId,
    recipeId,
    amount: ingredient.amount,
    unit: ingredient.unit,
  });
}

async function addRecipeStep(
  step: RecipeStepDTO,
  recipeFiles: Express.Multer.File[],
  recipeId: number
) {
  let stepImageUrl: string;
  const stepImage = recipeFiles.find(
    (file) => file.fieldname === `step${step.stepNumber}Image`
  );
  if (stepImage) {
    stepImageUrl = await uploadToImageKit(stepImage, "recipe");
    step.stepImage = stepImageUrl;
  }

  await recipesRepository.addRecipeStep(step, recipeId);
}

function findAllRecipes(filter: RecipeFilterDTO): Promise<RecipeResultDTO[]> {
  return recipesRepository.findAllRecipes(filter);
}

async function findRecipeById(recipeId: number) {
  const recipe = await recipesRepository.findRecipeDetailById(recipeId);
  if (!recipe) throw new HttpError(NO_RECIPE_FOUND, 404);
  return recipe;
}

async function likeRecipe(like: LikeDTO) {
  const recipe = await recipesRepository.findRecipeById(like.recipeId);
  if (!recipe) throw new HttpError(NO_RECIPE_FOUND, 400);
  const isLikeExists = await recipesRepository.checkIfLikeExists(like);
  if (isLikeExists) throw new HttpError(RECIPE_ALREADY_LIKED, 400);
  await recipesRepository.likeRecipe(like, recipe.recipeOwner);
}

async function unlikeRecipe(like: LikeDTO) {
  const recipe = await recipesRepository.findRecipeById(like.recipeId);
  if (!recipe) throw new HttpError(NO_RECIPE_FOUND, 400);
  await recipesRepository.unlikeRecipe(like, recipe.recipeOwner);
}

const recipesService = {
  addRecipe,
  findAllRecipes,
  findRecipeById,
  likeRecipe,
  unlikeRecipe,
};

export default recipesService;
