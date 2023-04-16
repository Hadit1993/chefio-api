import { Paginate } from "../generalTypes";

export type RecipeCategory = "food" | "drink" | "appetizer" | "dessert";

export interface CreateRecipeDTO {
  recipeName: string;
  recipeDescription?: string;
  recipeCoverImage?: string;
  cookingDuration: number;
  recipeOwner?: number;
  recipeCategory: RecipeCategory;
  ingredients: RecipeIngredientDTO[];
  steps: RecipeStepDTO[];
}

export interface RecipeIngredientDTO {
  ingredientId?: number;
  ingredientName?: string;
  amount: number;
  unit?: string;
}

export interface RecipeStepDTO {
  recipeId?: number;
  stepNumber: number;
  stepDescription: string;
  stepImage?: string;
}

export interface RecipeResultDTO {
  recipeName: string;
  recipeDescription?: string;
  recipeCoverImage?: string;
  cookingDuration: number;
  recipeCategory: RecipeCategory;
  recipeOwner: {
    userId: number;
    username: string;
    profileImage?: string;
  };
}

export interface RecipeDetailResultDTO extends RecipeResultDTO {
  ingredients: Omit<RecipeIngredientDTO, "ingredientId">[];
  steps: Omit<RecipeStepDTO, "recipeId">[];
}

export interface RecipeFilterDTO extends Paginate {
  category?: RecipeCategory;
  duration?: string;
  owner?: string;
  q?: string;
}
