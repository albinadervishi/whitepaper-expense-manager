import Team, { ITeam } from "../models/Team";
import Expense from "../models/Expense";
import mongoose from "mongoose";
import { ServiceResult, UpdateTeam, TeamType } from "../types";

export const teamService = {
  async getAllTeams(): Promise<ServiceResult<any[]>> {
    try {
      const teams = await Team.find().sort({ createdAt: -1 });
      return {
        success: true,
        data: teams.map((team) => ({
          ...team.toObject(),
          budgetStatus: team.getBudgetStatus(),
        })),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to fetch teams",
      };
    }
  },

  async getTeamById(teamId: string): Promise<ServiceResult<any>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return {
          success: false,
          error: "Invalid team ID",
        };
      }

      const team = await Team.findById(teamId);
      if (!team) {
        return {
          success: false,
          error: "Team not found",
        };
      }

      return {
        success: true,
        data: {
          ...team.toObject(),
          budgetStatus: team.getBudgetStatus(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to fetch team",
      };
    }
  },

  async createTeam(data: TeamType): Promise<ServiceResult<ITeam>> {
    try {
      const team = await Team.create({
        name: data.name,
        budget: data.budget,
        members: data.members || [],
        totalSpent: 0,
      });

      return {
        success: true,
        data: team,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to create team",
      };
    }
  },

  async updateTeam(
    teamId: string,
    data: UpdateTeam
  ): Promise<ServiceResult<ITeam>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return {
          success: false,
          error: "Invalid team ID",
        };
      }

      const team = await Team.findByIdAndUpdate(
        teamId,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!team) {
        return {
          success: false,
          error: "Team not found",
        };
      }

      return {
        success: true,
        data: team,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to update team",
      };
    }
  },

  async deleteTeam(teamId: string): Promise<ServiceResult<ITeam>> {
    try {
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return {
          success: false,
          error: "Invalid team ID",
        };
      }

      const expenseCount = await Expense.countDocuments({ teamId });
      if (expenseCount > 0) {
        return {
          success: false,
          error: "Cannot delete team with existing expenses",
        };
      }

      const team = await Team.findByIdAndDelete(teamId);
      if (!team) {
        return {
          success: false,
          error: "Team not found",
        };
      }

      return {
        success: true,
        data: team,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to delete team",
      };
    }
  },

  async recalculateTeamSpent(teamId: string): Promise<ServiceResult<number>> {
    try {
      const expenses = await Expense.find({
        teamId,
        status: { $in: ["approved", "pending"] },
      });

      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      await Team.findByIdAndUpdate(teamId, { totalSpent });

      return {
        success: true,
        data: totalSpent,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Failed to recalculate team spent",
      };
    }
  },
};
