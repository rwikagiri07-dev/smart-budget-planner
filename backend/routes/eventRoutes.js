import express from "express";

import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All Event routes are protected

// Create Event
router.post("/", protect, createEvent);

// Get Events
router.get("/", protect, getEvents);

// Update Event
router.put("/:id", protect, updateEvent);

// Delete Event
router.delete("/:id", protect, deleteEvent);

export default router;
