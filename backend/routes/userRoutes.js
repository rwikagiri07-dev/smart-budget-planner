import express from "express";

import {
  getUserSettings,
  updateUserSettings,
  changePassword,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get Settings
router.get("/settings", protect, getUserSettings);

// Update Settings
router.put("/settings", protect, updateUserSettings);

// Change Password
router.put("/change-password", protect, changePassword);

export default router;
