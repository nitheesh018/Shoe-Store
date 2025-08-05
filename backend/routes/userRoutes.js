import express from "express";
const router = express.Router();

import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Public routes
router.post("/", createUser);
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

// Authenticated user routes
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// Admin-only routes
router
  .route("/")
  .get(authenticate, authorizeAdmin, getAllUsers);

router
  .route("/:id")
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById)
  .delete(authenticate, authorizeAdmin, deleteUserById);

export default router;
