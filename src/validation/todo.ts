import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: z.string().optional(),
  is_completed: z.boolean(),
  priority: z.enum(["high", "medium", "low"], {
    error: "Priority must be 'high', 'medium', or 'low'",
  }),
  category_id: z
    .number()
    .int()
    .positive("Category ID must be a positive integer"),
});

export const updateToggleCompleteSchema = z.object({
  is_completed: z.boolean(),
});

export const updateTodoSchema = createTodoSchema.partial();

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type UpdateToggleCompleteTodoInput = z.infer<typeof updateToggleCompleteSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
