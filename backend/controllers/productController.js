import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Add new product
// @route   POST /api/products
// @access  Admin
const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    quantity,
    brand,
    countInStock,
  } = req.fields;

  const image = req.fields.image || req?.files?.image?.filepath;

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !quantity ||
    !brand ||
    !image ||
    !countInStock
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const product = new Product({
    name,
    description,
    price,
    category,
    quantity,
    brand,
    image,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Admin
const updateProductDetails = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    quantity,
    brand,
    countInStock,
  } = req.fields;

  const image = req.fields.image || req?.files?.image?.filepath;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.quantity = quantity || product.quantity;
  product.brand = brand || product.brand;
  product.image = image || product.image;
  product.countInStock = countInStock || product.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  await product.remove();
  res.json({ message: "Product deleted", name: product.name });
});

// @desc    Get all paginated/searchable products
// @route   GET /api/products
// @access  Public
const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category");

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// @desc    Get all products for admin
// @route   GET /api/products/allproducts
// @access  Admin
const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(products);
});

// @desc    Add a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ error: "Product already reviewed" });
  }

  const review = {
    name: req.user.username,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.numReviews;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

// @desc    Get latest products
// @route   GET /api/products/new
// @access  Public
const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(5);
  res.json(products);
});

// @desc    Filter products by category and price
// @route   POST /api/products/filtered-products
// @access  Public
const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;

  const filter = {};

  if (checked.length > 0) {
    filter.category = { $in: checked };
  }

  if (radio.length === 2) {
    filter.price = { $gte: radio[0], $lte: radio[1] };
  }

  const products = await Product.find(filter).populate("category");
  res.json(products);
});

export {
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
};
