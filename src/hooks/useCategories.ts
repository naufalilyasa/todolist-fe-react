import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryFn,
  deleteCategoryFn,
  getAllCategoriesFn,
  updateCategoryFn,
} from "@/api/categories";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/validation/category";

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Get all categories
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesFn,
  });

  // Create category
  const createCategory = useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategoryFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryInput;
    }) => updateCategoryFn({ categoryId, data }),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", categoryId] });
    },
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: (categoryId: string) => deleteCategoryFn(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    createCategory,
    deleteCategory,
    updateCategory,
  };
};
