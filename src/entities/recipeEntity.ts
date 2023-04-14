import { RecipeCategory } from "../dtos/recipeDTOS";

export interface RecipeEntity {
  recipeId: number;
  recipeName: string;
  recipeDescription?: string;
  recipeCoverImage?: string;
  cookingDuration: number;
  recipeCategory: RecipeCategory;
  recipeOwner: number;
  recipeCreatedDate: number;
}
