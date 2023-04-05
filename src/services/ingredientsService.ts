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

const ingredientsService = { addIngredient, getAllIngredients };
export default ingredientsService;
