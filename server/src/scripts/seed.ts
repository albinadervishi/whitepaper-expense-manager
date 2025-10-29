import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../models/Team";
import Expense from "../models/Expense";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await Team.deleteMany({});
    await Expense.deleteMany({});
    const teams = await Team.create([
      {
        name: "Engineering Team",
        budget: 50000,
        members: ["john@example.com", "jane@example.com", "bob@example.com"],
      },
      {
        name: "Marketing Team",
        budget: 30000,
        members: ["alice@example.com", "charlie@example.com"],
      },
      {
        name: "Sales Team",
        budget: 25000,
        members: ["dave@example.com", "eve@example.com"],
      },
    ]);

    const expenses = await Expense.create([
      {
        teamId: teams[0]!._id,
        amount: 2500,
        description: "AWS Cloud Services - Monthly",
        category: "equipment",
        status: "approved",
        date: new Date("2025-10-01"),
      },
      {
        teamId: teams[0]!._id,
        amount: 450,
        description: "Team lunch",
        category: "food",
        status: "approved",
        date: new Date("2025-10-15"),
      },
      {
        teamId: teams[0]!._id,
        amount: 1200,
        description: "Flight tickets",
        category: "travel",
        status: "pending",
        date: new Date("2025-10-20"),
      },
      {
        teamId: teams[1]!._id,
        amount: 5000,
        description: "Social media",
        category: "other",
        status: "approved",
        date: new Date("2025-10-05"),
      },
      {
        teamId: teams[1]!._id,
        amount: 800,
        description: "Supplies",
        category: "supplies",
        status: "approved",
        date: new Date("2025-10-12"),
      },
      {
        teamId: teams[2]!._id,
        amount: 3500,
        description: "Dinner",
        category: "food",
        status: "approved",
        date: new Date("2025-10-08"),
      },
      {
        teamId: teams[2]!._id,
        amount: 1800,
        description: "Travel to a meeting",
        category: "travel",
        status: "pending",
        date: new Date("2025-10-18"),
      },
    ]);

    for (const team of teams) {
      const teamExpenses = await Expense.find({ teamId: team._id });
      const totalSpent = teamExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = ((totalSpent / team.budget) * 100).toFixed(1);
    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedData();
