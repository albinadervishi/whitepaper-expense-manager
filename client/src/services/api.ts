import axios from "axios";
import type {
  Team,
  Expense,
  CreateTeamData,
  CreateExpenseData,
  ApiResponse,
  CategorySuggestionResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const teamApi = {
  getAll: () => api.get<ApiResponse<Team[]>>("/teams"),

  getById: (id: string) => api.get<ApiResponse<Team>>(`/teams/${id}`),

  create: (data: CreateTeamData) => api.post<ApiResponse<Team>>("/teams", data),

  update: (id: string, data: Partial<CreateTeamData>) =>
    api.put<ApiResponse<Team>>(`/teams/${id}`, data),

  delete: (id: string) => api.delete(`/teams/${id}`),
};

export const expenseApi = {
  getAll: () => {
    return api.get<ApiResponse<Expense[]>>(`/expenses`);
  },

  getById: (id: string) => api.get<ApiResponse<Expense>>(`/expenses/${id}`),

  create: (data: CreateExpenseData) =>
    api.post<ApiResponse<Expense>>("/expenses", data),

  update: (id: string, data: Partial<CreateExpenseData>) =>
    api.put<ApiResponse<Expense>>(`/expenses/${id}`, data),

  delete: (id: string) => api.delete(`/expenses/${id}`),
};

export const aiApi = {
  suggestCategory: (data: { description: string }) =>
    api.post<ApiResponse<CategorySuggestionResponse>>(
      "/ai/suggest-category",
      data
    ),
};

export default api;
