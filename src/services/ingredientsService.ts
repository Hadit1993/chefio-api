import { DUPLICATE_INGREDIENT } from "../constants/messages";
import IngredientEntity from "../entities/IngredientEntity";
import ingredientsRepository from "../repository/ingredientsRepository";
import { capitalizeFirstLetter } from "../transformers/stringTransformers";
import { HttpError } from "../utils/commonTypes";

async function addIngredient(name: string) {
  const ingredientName = capitalizeFirstLetter(name);
  const existedIngredient = await ingredientsRepository.findIngredientByName(
    ingredientName
  );
  if (existedIngredient) throw new HttpError(DUPLICATE_INGREDIENT, 400);
  await ingredientsRepository.addIngredient(ingredientName);
}

function getAllIngredients(): Promise<IngredientEntity[]> {
  return ingredientsRepository.findAllIngredients();
}

async function findOrCreateIngredient(name: string): Promise<number> {
  const ingredientName = capitalizeFirstLetter(name);
  const existedIngredient: any =
    await ingredientsRepository.findIngredientByName(ingredientName);
  if (existedIngredient) return existedIngredient.ingredient_id;

  return ingredientsRepository.addIngredient(ingredientName);
}

const ingredientsService = {
  addIngredient,
  getAllIngredients,
  findOrCreateIngredient,
};

export default ingredientsService;
