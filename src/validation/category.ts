import { z } from "zod";

export const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z
    .string()
    .regex(
      hexColorRegex,
      "Color must be a valid hex code (e.g. #RRGGBB or #RGB)"
    ),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z
    .string()
    .regex(
      hexColorRegex,
      "Color must be a valid hex code (e.g. #RRGGBB or #RGB)"
    )
    .optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
