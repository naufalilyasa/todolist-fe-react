import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type { GenericResponse } from "@/types/todo";
import type { Category } from "@/types/category";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/validation/category";

export const getAllCategoriesFn = async () => {
  try {
    const response = await api.get<
      {
        data: Category[];
      } & GenericResponse
    >("/categories");
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const createCategoryFn = async (data: CreateCategoryInput) => {
  try {
    const response = await api.post<GenericResponse>("/categories", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const updateCategoryFn = async ({
  categoryId,
  data,
}: {
  categoryId: string;
  data: UpdateCategoryInput;
}) => {
  try {
    const response = await api.put<GenericResponse>(
      `/categories/${categoryId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const deleteCategoryFn = async (categoryId: string) => {
  try {
    const response = await api.delete<GenericResponse>(
      `/categories/${categoryId}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};
