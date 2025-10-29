import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  budget: z.number().positive("Budget is required"),
  members: z
    .array(
      z.string().refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: "Invalid email address",
      })
    )
    .min(1, "At least one member is required"),
});

export const expenseSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  amount: z.number().positive("Amount is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().optional(),
});

export type TeamFormData = z.infer<typeof teamSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
