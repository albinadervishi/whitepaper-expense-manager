import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  budget: number;
  members: string[];
  totalSpent: number;
  alertSent80: boolean;
  alertSent100: boolean;
  createdAt: Date;
  updatedAt: Date;
  getBudgetStatus(): {
    budget: number;
    totalSpent: number;
    remaining: number;
    percentageUsed: number;
    status: "safe" | "warning" | "exceeded";
  };
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget must be positive"],
    },
    members: [
      {
        type: String,
        trim: true,
      },
    ],
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    alertSent80: {
      type: Boolean,
      default: false,
    },
    alertSent100: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.methods.getBudgetStatus = function () {
  const percentageUsed = (this.totalSpent / this.budget) * 100;
  let status: "safe" | "warning" | "exceeded" = "safe";

  if (percentageUsed >= 100) status = "exceeded";
  else if (percentageUsed >= 80) status = "warning";

  return {
    budget: this.budget,
    totalSpent: this.totalSpent,
    remaining: this.budget - this.totalSpent,
    percentageUsed: Math.round(percentageUsed * 10) / 10,
    status,
  };
};

export default mongoose.model<ITeam>("Team", TeamSchema);
