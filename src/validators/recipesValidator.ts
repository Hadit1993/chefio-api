import Joi, { object } from "joi";
import { CreateRecipeDTO, RecipeFilterDTO } from "../dtos/recipeDTOS";
import {
  NON_SEQUENTIAL_STEP_NUMBER,
  START_STEP_NUMBER,
} from "../constants/messages";

export function validateRecipe(recipe: CreateRecipeDTO) {
  const recipeIngredientSchema = Joi.object({
    ingredientId: Joi.number().integer().positive().min(1),
    ingredientName: Joi.string().min(2),
    amount: Joi.number().positive().required(),
    unit: Joi.string().min(1),
  })
    .or("ingredientId", "ingredientName")
    .xor("ingredientId", "ingredientName")
    .options({ abortEarly: false });
  const recipeStepSchema = Joi.object({
    stepNumber: Joi.number().positive().min(1).required(),
    stepDescription: Joi.string().min(10).required(),
  }).options({ abortEarly: false });
  return Joi.object({
    recipeName: Joi.string().min(3).required(),
    recipeDescription: Joi.string().min(10),
    coockingDuration: Joi.number().integer().positive().min(5).required(),
    recipeCategory: Joi.string()
      .valid("food", "drink", "appetizer", "dessert")
      .required(),
    ingredients: Joi.array()
      .items(recipeIngredientSchema)
      .unique((a, b) => a.ingredientId === b.ingredientId && a.ingredientId)
      .unique(
        (a, b) => a.ingredientName === b.ingredientName && a.ingredientName
      )
      .min(2)
      .required(),
    steps: Joi.array()
      .items(recipeStepSchema)
      .unique((a, b) => a.stepNumber === b.stepNumber && a.stepNumber)
      .min(2)
      .required()
      .custom((value, helpers) => {
        if (
          value.length === 0 ||
          value.some((item: any) => !item.stepNumber || !item.stepDescription)
        )
          return value;
        if (value[0].stepNumber !== 1) {
          return helpers.error("stepNumber", { message: START_STEP_NUMBER });
        }

        for (let i = 1; i < value.length; i++) {
          if (value[i].stepNumber !== value[i - 1].stepNumber + 1) {
            return helpers.error("stepNumber", {
              message: NON_SEQUENTIAL_STEP_NUMBER,
            });
          }
        }
        return value;
      }),
  })
    .messages({ stepNumber: "{{#message}}" })
    .options({ abortEarly: false })
    .validate(recipe);
}

export function validateRecipeFilters(filters: RecipeFilterDTO) {
  return Joi.object({
    page: Joi.number().integer().positive().min(1),
    limit: Joi.number().integer().positive().min(10),
    owner: Joi.number().integer().positive().min(1),
    category: Joi.string().valid("food", "drink", "appetizer", "dessert"),
    duration: Joi.number().integer().positive().min(5),
  })
    .options({ abortEarly: false })
    .validate(filters);
}
