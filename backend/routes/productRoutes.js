import express from "express";
import formidable from "express-formidable";

import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

const router = express.Router();

// ⚠️ ROUTE ORDER MATTERS: put `/filtered-products` before `/:id`
router.post("/filtered-products", filterProducts);

// Public product info
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

// Public (GET), Admin (POST)
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

// Admin access to full list
router.get("/allproducts", authenticate, authorizeAdmin, fetchAllProducts);

// Reviews - must be authenticated
router.post("/:id/reviews", authenticate, checkId, addProductReview);

// Single product - CRUD
router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

export default router;
