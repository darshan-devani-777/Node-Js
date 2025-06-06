const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const { isAdminOrSuperAdmin } = require("../middlewares/rbacMiddleware");

// (All roles: user/admin/superadmin)
router.get("/", protect, productController.getAllProducts);
router.get("/categories", protect, productController.getAllCategories);
router.get("/:id", protect, productController.getProductById);

// Admin/Superadmin Only
router.post("/", protect, isAdminOrSuperAdmin, productController.createProduct);
router.put("/:id", protect, isAdminOrSuperAdmin, productController.updateProduct);
router.delete("/:id", protect, isAdminOrSuperAdmin, productController.deleteProduct);

module.exports = router;
