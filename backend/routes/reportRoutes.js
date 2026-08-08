import express from "express";

import {
  getDashboardStats,
  getExpenseReport,
} from "../controllers/reportController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Full Report (used by Reports.jsx)
router.get("/", protect, getExpenseReport);

// Dashboard Statistics
router.get("/dashboard", protect, getDashboardStats);

// Expense Reports
router.get("/expenses", protect, getExpenseReport);

export default router;
