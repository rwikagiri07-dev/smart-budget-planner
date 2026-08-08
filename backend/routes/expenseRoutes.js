import express from "express";

import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All Expense routes are protected

// Create Expense
router.post("/", protect, createExpense);

// Get Expenses
router.get("/", protect, getExpenses);

// Update Expense
router.put("/:id", protect, updateExpense);

// Delete Expense
router.delete("/:id", protect, deleteExpense);

export default router;
