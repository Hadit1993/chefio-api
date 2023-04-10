import {
  CreateRecipeDTO,
  RecipeDetailResultDTO,
  RecipeFilterDTO,
  RecipeResultDTO,
  RecipeStepDTO,
} from "../dtos/recipeDTOS";
import handleQuery from "../handlers/queryHandler";
import { snakeToCamel } from "../transformers/snakeToCamelTransformer";

async function addRecipe(
  recipe: Omit<CreateRecipeDTO, "ingredients" | "steps">
): Promise<number> {
  const result: any = await handleQuery(
    "INSERT INTO recipes (recipe_name, recipe_description, recipe_cover_image, cooking_duration, recipe_owner, recipe_category) VALUES(?, ?, ?, ?, ?, ?)",
    [
      recipe.recipeName,
      recipe.recipeDescription,
      recipe.recipeCoverImage,
      recipe.cookingDuration,
      recipe.recipeOwner,
      recipe.recipeCategory,
    ]
  );

  return result.insertId;
}

async function addRecipeIngredient(input: {
  ingredientId: number;
  recipeId: number;
  amount: number;
  unit?: string;
}): Promise<number> {
  const result: any = await handleQuery(
    "INSERT INTO recipe_ingredients (ingredient_id, recipe_id, amount, unit) VALUES(?, ?, ?, ?)",
    [input.ingredientId, input.recipeId, input.amount, input.unit]
  );

  return result.insertId;
}

async function addRecipeStep(
  step: RecipeStepDTO,
  recipeId: number
): Promise<number> {
  const result = await handleQuery(
    "INSERT INTO recipe_steps (recipe_id, step_number, step_description, step_image) VALUES(?, ?, ?, ?)",
    [recipeId, step.stepNumber, step.stepDescription, step.stepImage]
  );

  return result.insertId;
}

async function findAllRecipes(
  filter: RecipeFilterDTO
): Promise<RecipeResultDTO[]> {
  const page = parseInt(filter.page!);
  const limit = parseInt(filter.limit!);
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  const values: any[] = [];
  let query =
    "SELECT recipes.*, users.user_id as user_id, users.username as username, users.profile_image as profile_image FROM recipes JOIN users ON recipes.recipe_owner = users.user_id";

  if (filter.category) {
    conditions.push("recipes.recipe_category = ?");
    values.push(filter.category);
  }

  if (filter.duration) {
    conditions.push("recipes.cooking_duration <= ?");
    values.push(filter.duration);
  }

  if (filter.owner) {
    conditions.push("recipes.recipe_owner = ?");
    values.push(filter.owner);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += " LIMIT ? OFFSET ?";
  values.push(limit);
  values.push(offset);

  const result = (await handleQuery(query, values)) as any[];

  const transformedResult = result.map((val) => snakeToCamel(val)) as any[];

  return transformedResult.map((val) => {
    const { recipeOwner, userId, username, profileImage, ...recipe } = val;
    return { ...recipe, recipeOwner: { userId, username, profileImage } };
  });
}

async function findRecipeById(recipeId: number) {
  const result = (await handleQuery(
    `
  SELECT r.*, u.user_id as user_id, u.username as username, u.profile_image as profile_image , i.ingredient_name AS ingredient_name, ri.amount, ri.unit, rs.step_number, rs.step_description, rs.step_image
  FROM recipes r
  JOIN users u ON r.recipe_owner = u.user_id
  JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
  JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
  JOIN recipe_steps rs ON r.recipe_id = rs.recipe_id
  WHERE r.recipe_id = ?
  ORDER BY rs.step_number;
      `,
    [recipeId]
  )) as any[];
  if (result.length === 0) return undefined;
  const transformedResult = result.map((val) => snakeToCamel(val) as any);
  const {
    recipeName,
    recipeDescription,
    recipeCoverImage,
    cookingDuration,
    recipeCategory,
    userId,
    username,
    profileImage,
  } = transformedResult[0];

  const recipe = {
    recipeName,
    recipeDescription,
    recipeCoverImage,
    cookingDuration,
    recipeCategory,
    recipeOwner: { userId, username, profileImage },
  };
  const ingredients: any[] = [];
  const steps: any[] = [];
  const ingredientNames = new Set<string>();
  const stepNumbers = new Set<number>();
  transformedResult.forEach((value) => {
    const {
      ingredientName,
      amount,
      unit,
      stepNumber,
      stepDescription,
      stepImage,
    } = value;

    if (!ingredientNames.has(ingredientName)) {
      ingredients.push({
        ingredientName,
        amount,
        unit,
      });
      ingredientNames.add(ingredientName);
    }

    if (!stepNumbers.has(stepNumber)) {
      steps.push({
        stepNumber,
        stepDescription,
        stepImage,
      });
      stepNumbers.add(stepNumber);
    }
  });

  return { ...recipe, ingredients, steps };
}

const recipesRepository = {
  addRecipe,
  addRecipeIngredient,
  addRecipeStep,
  findAllRecipes,
  findRecipeById,
};
export default recipesRepository;
