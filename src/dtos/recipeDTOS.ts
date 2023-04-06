export interface CreateRecipeDTO {
  recipeName: string;
  recipeDescription?: string;
  recipeCoverImage?: string;
  coockingDuration: number;
  recipeOwner?: number;
  recipeCategory: "food" | "drink" | "appetizer" | "dessert";
  ingredients: RecipeIngredientDTO[];
  steps: RecipeStepDTO[];
}

interface RecipeIngredientDTO {
  ingredientId?: number;
  ingredientName?: string;
  amount: number;
  unit?: string;
}

interface RecipeStepDTO {
  recipeId?: number;
  stepNumber: number;
  stepDescription: string;
  stepImage?: string;
}
