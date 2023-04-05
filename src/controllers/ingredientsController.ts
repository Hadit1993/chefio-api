import { INGREDIENT_ADDED } from "../constants/messages";
import BaseResponse from "../dtos/BaseResponse";
import ingredientsService from "../services/ingredientsService";
import tryRequest from "../utils/tryRequest";

const addIngredient = tryRequest<{ name: string }>(async (req, res, _) => {
  await ingredientsService.addIngredient(req.body.name);
  res
    .status(201)
    .json(new BaseResponse(undefined, { message: INGREDIENT_ADDED }));
});

const getAllIngredients = tryRequest(async (_, res, __) => {
  const ingredients = await ingredientsService.getAllIngredients();
  return res.json(new BaseResponse(ingredients));
});

const ingredientsController = { addIngredient, getAllIngredients };

export default ingredientsController;
