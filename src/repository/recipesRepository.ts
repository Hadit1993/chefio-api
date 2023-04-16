import { dbConnection } from "../configs/dbConfig";
import { NO_RECIPE_FOUND } from "../constants/messages";
import { LikeDTO } from "../dtos/likeDto";
import {
  CreateRecipeDTO,
  RecipeFilterDTO,
  RecipeResultDTO,
  RecipeStepDTO,
} from "../dtos/recipeDTOS";
import { RecipeEntity } from "../entities/recipeEntity";
import handleQuery, {
  handleQueryInTransaction,
} from "../handlers/queryHandler";
import { snakeToCamel } from "../transformers/snakeToCamelTransformer";
import { HttpError } from "../utils/commonTypes";
import notificationsRepository from "./notificationsRepository";

async function addRecipe(
  recipe: Omit<CreateRecipeDTO, "ingredients" | "steps">
): Promise<number> {
  const result: any = await handleQueryInTransaction(
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
  const result: any = await handleQueryInTransaction(
    "INSERT INTO recipe_ingredients (ingredient_id, recipe_id, amount, unit) VALUES(?, ?, ?, ?)",
    [input.ingredientId, input.recipeId, input.amount, input.unit]
  );

  return result.insertId;
}

async function addRecipeStep(
  step: RecipeStepDTO,
  recipeId: number
): Promise<number> {
  const result = await handleQueryInTransaction(
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
    "SELECT recipes.*, users.user_id, users.username, users.profile_image FROM recipes JOIN users ON recipes.recipe_owner = users.user_id";

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
  if (filter.q) {
    conditions.push("recipes.recipe_name LIKE ?");
    values.push(`%${filter.q}%`);
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

async function findRecipeDetailById(recipeId: number) {
  const result = (await handleQuery(
    `
  SELECT r.*, u.user_id, u.username, u.profile_image , i.ingredient_name, ri.amount, ri.unit, rs.step_number, rs.step_description, rs.step_image
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

async function checkIfRecipeExists(recipeId: number): Promise<boolean> {
  const result = await handleQuery(
    "SELECT EXISTS (SELECT 1 from recipes WHERE recipe_id = ?)",
    recipeId
  );
  console.log("result", result);
  return !!result[0].exists;
}

async function findRecipeById(
  recipeId: number
): Promise<RecipeEntity | undefined> {
  const results: any[] = await handleQuery(
    "SELECT * FROM recipes WHERE recipe_id = ?",
    recipeId
  );
  if (results.length === 0) return undefined;
  return snakeToCamel(results[0]);
}

async function checkIfLikeExists(like: LikeDTO): Promise<boolean> {
  const results = await handleQuery(
    "SELECT EXISTS (SELECT 1 from likes WHERE recipe_id = ? AND like_owner = ?) AS result",
    [like.recipeId, like.likeOwner]
  );
  return !!results[0].result;
}

async function insertRecipeLike(like: LikeDTO) {
  await handleQueryInTransaction(
    "INSERT INTO likes (like_owner, recipe_id) VALUES(?, ?)",
    [like.likeOwner, like.recipeId]
  );
}

async function deleteRecipeLike(like: LikeDTO) {
  await handleQueryInTransaction(
    "DELETE FROM likes WHERE like_owner = ? AND recipe_id = ?",
    [like.likeOwner, like.recipeId]
  );
}

async function likeRecipe(like: LikeDTO, recipeOwner: number): Promise<void> {
  return new Promise((resolve, reject) => {
    dbConnection.beginTransaction(async (error) => {
      try {
        if (error) throw new HttpError(error.message, 400);

        await insertRecipeLike(like);
        if (recipeOwner !== like.likeOwner) {
          await notificationsRepository.addNotification({
            notifOwner: recipeOwner,
            notifEmitter: like.likeOwner,
            recipeId: like.recipeId,
            notifType: "like",
          });
        }

        dbConnection.commit((commitError) => {
          if (commitError) {
            dbConnection.rollback(() => {
              throw new HttpError(commitError.message, 400);
            });
          } else return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  });
}

async function unlikeRecipe(like: LikeDTO, recipeOwner: number): Promise<void> {
  return new Promise((resolve, reject) => {
    dbConnection.beginTransaction(async (error) => {
      try {
        if (error) throw new HttpError(error.message, 400);

        await deleteRecipeLike(like);

        if (recipeOwner !== like.likeOwner)
          await notificationsRepository.deleteNotification({
            notifOwner: recipeOwner,
            notifEmitter: like.likeOwner,
            recipeId: like.recipeId,
            notifType: "like",
          });

        dbConnection.commit((commitError) => {
          if (commitError) {
            dbConnection.rollback(() => {
              throw new HttpError(commitError.message, 400);
            });
          } else return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  });
}

const recipesRepository = {
  addRecipe,
  addRecipeIngredient,
  addRecipeStep,
  findAllRecipes,
  findRecipeDetailById,
  checkIfRecipeExists,
  checkIfLikeExists,
  likeRecipe,
  findRecipeById,
  unlikeRecipe,
};
export default recipesRepository;
