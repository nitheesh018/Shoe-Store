import express from "express";
const router = express.Router();

import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Public Routes
router.get("/categories", listCategory);
router.get("/category/:id", readCategory);

//  Admin Routes (Create / Update / Delete)
router.post("/", authenticate, authorizeAdmin, createCategory);
router.put("/:categoryId", authenticate, authorizeAdmin, updateCategory);   // updated route
router.delete("/:categoryId", authenticate, authorizeAdmin, removeCategory); // updated route

export default router;
