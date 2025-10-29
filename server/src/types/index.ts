export interface TeamType {
  name: string;
  budget: number;
  members?: string[];
}

export interface ExpenseType {
  teamId: string;
  amount: number;
  description: string;
  category?:
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
  date?: Date;
  status?: "pending" | "approved" | "rejected";
}

export type UpdateTeam = Partial<TeamType>;
export type UpdateExpense = Partial<ExpenseType> & { teamId?: never };

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BudgetStatus {
  budget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  status: "safe" | "warning" | "exceeded";
}
