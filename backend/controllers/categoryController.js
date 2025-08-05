import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Create new category
// @route   POST /api/category
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Name is required");
  }

  const trimmedName = name.trim();
  const existingCategory = await Category.findOne({ name: trimmedName });

  if (existingCategory) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({ name: trimmedName });
  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/category/:categoryId
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (name && name.trim()) {
    category.name = name.trim();
  }

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/category/:categoryId
// @access  Admin
const removeCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully" });
});

// @desc    Get all categories
// @route   GET /api/category/categories
// @access  Public
const listCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/category/category/:id
// @access  Public
const readCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
