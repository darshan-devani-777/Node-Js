const Product = require("../models/product.model");
const { StatusCodes } = require("http-status-codes");

// CREATE PRODUCT (admin / superadmin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categories, quantity } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      categories,
      quantity,   
      createdBy: req.user._id,
    });

    const savedProduct = await newProduct.save();

    res.json({
      statusCode:StatusCodes.CREATED,
      success: true,
      message: "Product Created Successfully",
      product: savedProduct,
    });
  } catch (err) {
    res.json({ statusCode:StatusCodes.INTERNAL_SERVER_ERROR , success: false, message: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS (accessible to all)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "name email role");
    res.json({ statusCode:StatusCodes.OK , success: true, products });
  } catch (err) {
    res.json({ statusCode:StatusCodes.INTERNAL_SERVER_ERROR , success: false, message: "Internal Server Error" });
  }
};

// GET SPECIFIC ID (accessible to all)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email role");
    if (!product) return res.status(404).json({ statusCode:StatusCodes.NOT_FOUND , success:false , message: "Product not found" });

    res.json({ statusCode:StatusCodes.OK , success: true , message: "Product Retrieved Successfully..." , product });
  } catch (err) {
    res.json({ statusbar:StatusCodes.INTERNAL_SERVER_ERROR , success:false , message: "Internal Server Error" });
  }
};

// UPDATE (admin / superadmin only)
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body }, 
      { new: true }
    ).populate("createdBy", "name email role");

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, message: "Product Updated Successfully...", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE PRODUCT (admin / superadmin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email role");

    if (!product) {
      return json({ statusCode:StatusCodes.NOT_FOUND , success: false, message: "Product not found" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      statusCode:StatusCodes.OK,
      success: true,
      message: "Product Deleted Successfully",
      deletedProduct: product,
    });

  } catch (err) {
    console.error("Delete Error:", err);
    res.json({ statusCode:StatusCodes.INTERNAL_SERVER_ERROR , success: false, message: "Internal Server Error" });
  }
};

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("categories");
    res.json({ statusCode:StatusCodes.OK , success: true, message: "Fetched All Categories..." , categories });
  } catch (err) {
    res.json({ statusCode:StatusCodes.INTERNAL_SERVER_ERROR , success: false, message: "Internal Server Error" });
  }
};
