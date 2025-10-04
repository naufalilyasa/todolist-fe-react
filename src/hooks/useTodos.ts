import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateTodoInput,
  UpdateTodoInput,
  UpdateToggleCompleteTodoInput,
} from "@/validation/todo";
import {
  createTodoFn,
  deleteTodoFn,
  getAllTodosFn,
  getTodoByIdFn,
  toggleCompleteTodoFn,
  updateTodoFn,
} from "@/api/todos";
import type { TodoQueryParams } from "@/types/todo";

export const useTodos = (params: TodoQueryParams = {}) => {
  const queryClient = useQueryClient();

  // Default pagination
  const {
    page = 1,
    limit = 10,
    search,
    status,
    priority,
    category_id,
  } = params;

  // Get all todos (with filters & pagination)
  const todos = useQuery({
    queryKey: ["todos", { page, limit, search, status, priority, category_id }],
    queryFn: () =>
      getAllTodosFn({
        page,
        limit,
        search,
        status,
        priority,
        category_id,
      }),
  });

  // Get single todo
  const useTodo = (todoId?: string) =>
    useQuery({
      queryKey: ["todos", todoId],
      queryFn: () => {
        if (!todoId) return undefined;
        return getTodoByIdFn(todoId);
      },
      enabled: !!todoId,
    });

  // Create todo
  const createTodo = useMutation({
    mutationFn: (data: CreateTodoInput) => createTodoFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Update todo
  const updateTodo = useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: UpdateTodoInput }) =>
      updateTodoFn({ todoId, data }),
    onSuccess: (_, { todoId }) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todos", todoId] });
    },
  });

  // Delete todo
  const deleteTodo = useMutation({
    mutationFn: (todoId: string) => deleteTodoFn(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Toggle complete
  const toggleComplete = useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: string;
      data: UpdateToggleCompleteTodoInput;
    }) => toggleCompleteTodoFn({ todoId, data }),
    onSuccess: (_, { todoId }) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todos", todoId] });
    },
  });

  return {
    todos,
    useTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
};
