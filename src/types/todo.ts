import type { Category } from "./category";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  is_completed: boolean;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

export type GenericResponse = {
  status: string;
  statusCode: number;
  message: string;
};

export interface TodoQueryParams {
  status?: "pending" | "completed";
  priority?: "High" | "Medium" | "Low";
  category_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};
