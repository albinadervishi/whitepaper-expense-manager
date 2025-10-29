import express from "express";
import { expenseService } from "../services/expenseService";
import { ExpenseType } from "../types";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await expenseService.getAllExpenses();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.data?.length || 0,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await expenseService.getExpenseById(req.params.id);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const expenseData: ExpenseType = {
      teamId: req.body.teamId,
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date ? new Date(req.body.date) : undefined,
      status: req.body.status,
    };

    const result = await expenseService.createExpense(expenseData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await expenseService.updateExpense(req.params.id, req.body);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);

    if (!result.success) {
      const status = result.error?.includes("not found") ? 404 : 400;
      return res.status(status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
