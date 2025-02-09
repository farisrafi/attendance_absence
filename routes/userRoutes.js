import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../utils/middleware.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, getUserProfile);

// Update user profile
router.put("/profile", authenticateToken, updateUserProfile);

export default router;
