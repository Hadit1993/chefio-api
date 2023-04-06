import tryRequest from "../utils/tryRequest";
import { CreateRecipeDTO } from "../dtos/recipeDTOS";

const addRecipe = tryRequest<CreateRecipeDTO>(async (req, res, next) => {
  return res
    .status(201)
    .json({ data: req.body, message: "everything is correct" });
});

const recipesController = { addRecipe };

export default recipesController;
