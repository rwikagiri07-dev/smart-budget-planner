import express from "express";

import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All Budget routes are protected

// Create Budget
router.post("/", protect, createBudget);

// Get All Budgets
router.get("/", protect, getBudgets);

// Update Budget
router.put("/:id", protect, updateBudget);

// Delete Budget
router.delete("/:id", protect, deleteBudget);

export default router;
