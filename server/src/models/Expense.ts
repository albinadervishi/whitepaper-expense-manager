import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  teamId: mongoose.Types.ObjectId;
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
  date: Date;
  createdAt: Date;
}

const ExpenseSchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
    index: true,
  },
  amount: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      "travel",
      "food",
      "supplies",
      "equipment",
      "marketing",
      "subscriptions",
      "services",
      "rentals",
      "utilities",
      "entertainment",
      "other",
    ],
    default: "other",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

ExpenseSchema.index({ teamId: 1, date: -1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
