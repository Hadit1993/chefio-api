import IngredientEntity from "../entities/IngredientEntity";
import handleQuery from "../handlers/queryHandler";
import { snakeToCamel } from "../transformers/snakeToCamelTransformer";

async function findIngredientByName(name: string) {
  const result = (await handleQuery(
    "SELECT * FROM ingredients WHERE ingredient_name=?",
    name
  )) as any[];
  if (result.length === 0) return undefined;
  else return result[0];
}

async function findAllIngredients(): Promise<IngredientEntity[]> {
  const result = (await handleQuery(
    "SELECT * FROM ingredients ORDER BY ingredient_name",
    []
  )) as any[];
  return result.map((ing) => snakeToCamel(ing));
}

async function addIngredient(name: string): Promise<number> {
  const result: any = await handleQuery(
    "INSERT INTO ingredients (ingredient_name) VALUES(?)",
    name
  );
  return result.insertId;
}

const ingredientsRepository = {
  findIngredientByName,
  addIngredient,
  findAllIngredients,
};
export default ingredientsRepository;
