import tryRequest from "../utils/tryRequest";
import { CreateRecipeDTO, RecipeFilterDTO } from "../dtos/recipeDTOS";
import recipesService from "../services/recipesService";
import BaseResponse from "../dtos/BaseResponse";
import { RECIPE_CREATED } from "../constants/messages";
import recipesRepository from "../repository/recipesRepository";

const addRecipe = tryRequest<CreateRecipeDTO>(async (req, res, _) => {
  req.body.recipeOwner = req.userId;

  await recipesService.addRecipe(req.body, req.files as Express.Multer.File[]);
  return res
    .status(201)
    .json(new BaseResponse(undefined, { message: RECIPE_CREATED }));
});

const findAllRecipes = tryRequest(async (req, res, _) => {
  const { page = "1", limit = "20", ...others } = req.query as RecipeFilterDTO;
  const recipes = await recipesService.findAllRecipes({
    page,
    limit,
    ...others,
  });
  return res.json(new BaseResponse(recipes));
});

const findRecipeById = tryRequest(async (req, res, _) => {
  const recipeId = parseInt(req.params.recipeId);
  const recipe = await recipesService.findRecipeById(recipeId);
  res.json(new BaseResponse(recipe));
});

const findUserRecipes = tryRequest(async (req, res, _) => {
  req.query.owner = `${req.userId}`;
  const { page = "1", limit = "20", ...others } = req.query as RecipeFilterDTO;
  const recipes = await recipesService.findAllRecipes({
    page,
    limit,
    ...others,
  });
  return res.json(new BaseResponse(recipes));
});

const likeRecipe = tryRequest(async (req, res, _) => {
  const recipeId = parseInt(req.params.recipeId);
  const likeOwner = req.userId!;
  await recipesService.likeRecipe({ recipeId, likeOwner });

  res.json(new BaseResponse());
});

const unlikeRecipe = tryRequest(async (req, res, _) => {
  const recipeId = parseInt(req.params.recipeId);
  const likeOwner = req.userId!;
  await recipesService.unlikeRecipe({ recipeId, likeOwner });
  res.json(new BaseResponse());
});

const recipesController = {
  addRecipe,
  findAllRecipes,
  findRecipeById,
  findUserRecipes,
  likeRecipe,
  unlikeRecipe,
};

export default recipesController;
