import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type {
  GenericResponse,
  Pagination,
  Todo,
  TodoQueryParams,
} from "@/types/todo";
import type {
  CreateTodoInput,
  UpdateTodoInput,
  UpdateToggleCompleteTodoInput,
} from "@/validation/todo";

export const getAllTodosFn = async (
  params?: TodoQueryParams
): Promise<{ todos: Todo[]; pagination: Pagination }> => {
  try {
    const response = await api.get<
      {
        data: Todo[];
      } & GenericResponse & {
          pagination: Pagination;
        }
    >("/todos", { params });

    return {
      todos: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const getTodoByIdFn = async (todoId: string) => {
  try {
    const response = await api.get<
      {
        data: Todo;
      } & GenericResponse
    >(`/todos/${todoId}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const createTodoFn = async (data: CreateTodoInput) => {
  try {
    const response = await api.post<GenericResponse>("/todos", data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const updateTodoFn = async ({
  todoId,
  data,
}: {
  todoId: string;
  data: UpdateTodoInput;
}) => {
  try {
    const response = await api.put<GenericResponse>(`/todos/${todoId}`, data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const toggleCompleteTodoFn = async ({
  todoId,
  data,
}: {
  todoId: string;
  data: UpdateToggleCompleteTodoInput;
}) => {
  try {
    const response = await api.patch<GenericResponse>(
      `/todos/${todoId}/complete`,
      data
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

export const deleteTodoFn = async (todoId: string) => {
  try {
    const response = await api.delete<GenericResponse>(`/todos/${todoId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};
