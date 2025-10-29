import Expense, { IExpense } from "../models/Expense";
import { emailService } from "./emailService";
import Team from "../models/Team";
import { teamService } from "./teamService";
import mongoose from "mongoose";
import { ServiceResult, UpdateExpense, ExpenseType } from "../types";

export const expenseService = {
  async getAllExpenses(): Promise<ServiceResult<IExpense[]>> {
    try {
      const query: any = {};

      const expenses = await Expense.find(query)
        .populate("teamId", "name budget")
        .sort({ date: -1 });

      return {
        success: true,
        data: expenses,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to fetch expenses",
      };
    }
  },

  async getExpenseById(expenseId: string): Promise<ServiceResult<IExpense>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        return {
          success: false,
          error: "Invalid expense ID",
        };
      }

      const expense = await Expense.findById(expenseId).populate(
        "teamId",
        "name budget"
      );
      if (!expense) {
        return {
          success: false,
          error: "Expense not found",
        };
      }

      return {
        success: true,
        data: expense,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to fetch expense",
      };
    }
  },

  async createExpense(data: ExpenseType): Promise<ServiceResult<IExpense>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(data.teamId)) {
        return {
          success: false,
          error: "Invalid team ID",
        };
      }

      const team = await Team.findById(data.teamId);
      if (!team) {
        return {
          success: false,
          error: "Team not found",
        };
      }

      const budgetStatus = team.getBudgetStatus();
      const newSpent = budgetStatus.totalSpent + data.amount;
      const newPercentage = (newSpent / team.budget) * 100;

      if (newPercentage > 100) {
        return {
          success: false,
          error: "Cannot create expense. This would exceed budget",
        };
      }

      const expense = await Expense.create({
        teamId: data.teamId,
        amount: data.amount,
        description: data.description,
        category: data.category || "other",
        date: data.date || new Date(),
        status: data.status || "pending",
      });

      await teamService.recalculateTeamSpent(data.teamId);

      try {
        const updatedTeam = await Team.findById(data.teamId);
        if (updatedTeam && updatedTeam.members.length > 0) {
          const finalStatus = updatedTeam.getBudgetStatus();

          if (
            finalStatus.percentageUsed >= 80 &&
            finalStatus.percentageUsed < 100 &&
            !updatedTeam.alertSent80
          ) {
            const emailResult = await emailService.sendBudgetAlert({
              to: updatedTeam.members,
              teamName: updatedTeam.name,
              budget: updatedTeam.budget,
              spent: finalStatus.totalSpent,
              percentage: Math.round(finalStatus.percentageUsed),
              threshold: "80%",
            });

            if (emailResult.success) {
              updatedTeam.alertSent80 = true;
              await updatedTeam.save();
            } else {
              console.error("Failed to send 80% alert:", emailResult.error);
            }
          }

          if (finalStatus.percentageUsed >= 100 && !updatedTeam.alertSent100) {
            const emailResult = await emailService.sendBudgetAlert({
              to: updatedTeam.members,
              teamName: updatedTeam.name,
              budget: updatedTeam.budget,
              spent: finalStatus.totalSpent,
              percentage: Math.round(finalStatus.percentageUsed),
              threshold: "100%",
            });

            if (emailResult.success) {
              updatedTeam.alertSent100 = true;
              await updatedTeam.save();
            } else {
              console.error("Failed to send 100% alert:", emailResult.error);
            }
          }
        }
      } catch (emailError) {
        console.error("Error sending budget alert:", emailError);
      }

      const populatedExpense = await expense.populate("teamId", "name budget");

      return {
        success: true,
        data: populatedExpense,
      };
    } catch (error: any) {
      console.error("Expense creation error:", error);
      return {
        success: false,
        error: error?.message || "Failed to create expense",
      };
    }
  },

  async updateExpense(
    expenseId: string,
    data: UpdateExpense
  ): Promise<ServiceResult<IExpense>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        return {
          success: false,
          error: "Invalid expense ID",
        };
      }

      const oldExpense = await Expense.findById(expenseId);
      if (!oldExpense) {
        return {
          success: false,
          error: "Expense not found",
        };
      }

      if (data.amount !== undefined && data.amount !== oldExpense.amount) {
        const team = await Team.findById(oldExpense.teamId);
        if (team) {
          const currentSpent = team.totalSpent - oldExpense.amount;
          const newSpent = currentSpent + data.amount;
          const newPercentage = (newSpent / team.budget) * 100;

          if (newPercentage > 100) {
            return {
              success: false,
              error: "Cannot update expense. This would exceed budget ",
            };
          }
        }
      }

      const updatedExpense = await Expense.findByIdAndUpdate(
        expenseId,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!updatedExpense) {
        return {
          success: false,
          error: "Failed to update expense",
        };
      }

      await teamService.recalculateTeamSpent(oldExpense.teamId.toString());
      const updatedTeam = await Team.findById(oldExpense.teamId);

      if (updatedTeam && updatedTeam.members.length > 0) {
        const finalStatus = updatedTeam.getBudgetStatus();

        if (
          finalStatus.percentageUsed >= 80 &&
          finalStatus.percentageUsed < 100
        ) {
          if (!updatedTeam.alertSent80) {
            const emailResult = await emailService.sendBudgetAlert({
              to: updatedTeam.members,
              teamName: updatedTeam.name,
              budget: updatedTeam.budget,
              spent: finalStatus.totalSpent,
              percentage: Math.round(finalStatus.percentageUsed),
              threshold: "80%",
            });
            if (emailResult.success) {
              updatedTeam.alertSent80 = true;
              await updatedTeam.save();
            }
          }
        } else if (finalStatus.percentageUsed < 80) {
          updatedTeam.alertSent80 = false;
          await updatedTeam.save();
        }

        if (finalStatus.percentageUsed >= 100 && !updatedTeam.alertSent100) {
          const emailResult = await emailService.sendBudgetAlert({
            to: updatedTeam.members,
            teamName: updatedTeam.name,
            budget: updatedTeam.budget,
            spent: finalStatus.totalSpent,
            percentage: Math.round(finalStatus.percentageUsed),
            threshold: "100%",
          });
          if (emailResult.success) {
            updatedTeam.alertSent100 = true;
            await updatedTeam.save();
          }
        } else if (finalStatus.percentageUsed < 100) {
          updatedTeam.alertSent100 = false;
          await updatedTeam.save();
        }
      }

      const populatedExpense = await updatedExpense.populate(
        "teamId",
        "name budget"
      );

      return {
        success: true,
        data: populatedExpense,
      };
    } catch (error: any) {
      console.error("Expense update error:", error);
      return {
        success: false,
        error: error?.message || "Failed to update expense",
      };
    }
  },

  async deleteExpense(expenseId: string): Promise<ServiceResult<IExpense>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(expenseId)) {
        return {
          success: false,
          error: "Invalid expense ID",
        };
      }

      const expense = await Expense.findById(expenseId);
      if (!expense) {
        return {
          success: false,
          error: "Expense not found",
        };
      }

      await Expense.findByIdAndDelete(expenseId);

      await teamService.recalculateTeamSpent(expense.teamId.toString());
      const updatedTeam = await Team.findById(expense.teamId);

      if (updatedTeam && updatedTeam.members.length > 0) {
        const finalStatus = updatedTeam.getBudgetStatus();

        if (finalStatus.percentageUsed < 80) {
          updatedTeam.alertSent80 = false;
        }
        if (finalStatus.percentageUsed < 100) {
          updatedTeam.alertSent100 = false;
        }
        await updatedTeam.save();
      }

      return {
        success: true,
        data: expense,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to delete expense",
      };
    }
  },
};
