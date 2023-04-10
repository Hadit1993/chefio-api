import { REQUIRED_RECIPE_IMAGE } from "../constants/messages";
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
  console.log("recipeId", recipeId);

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

function findRecipeById(recipeId: number) {
  return recipesRepository.findRecipeById(recipeId);
}

const recipesService = { addRecipe, findAllRecipes, findRecipeById };

export default recipesService;
