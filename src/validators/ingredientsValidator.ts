import Joi from "joi";

export function validateIngredientName(input: { name: string }) {
  return Joi.object({
    name: Joi.string().min(2).required(),
  }).validate(input);
}
