export interface Team {
  _id: string;
  name: string;
  budget: number;
  members: string[];
  totalSpent: number;
  alertSent80: boolean;
  alertSent100: boolean;
  createdAt: string;
  updatedAt: string;
  budgetStatus: BudgetStatus;
}

export interface BudgetStatus {
  budget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  status: "safe" | "warning" | "exceeded";
}

export interface Expense {
  _id: string;
  teamId: string | Team;
  amount: number;
  description: string;
  category:
    | "travel"
    | "food"
    | "supplies"
    | "equipment"
    | "marketing"
    | "subscriptions"
    | "services"
    | "rentals"
    | "utilities"
    | "entertainment"
    | "other";
  status: "pending" | "approved" | "rejected";
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamData {
  name: string;
  budget: number;
  members?: string[];
}

export interface CreateExpenseData {
  teamId: string;
  amount: number;
  description: string;
  category?: string;
  date?: string;
  status?: string;
}

export interface CategorySuggestionResponse {
  category: string;
  confidence: number;
  reasoning: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export * from "./validation";
export * from "./enum";
