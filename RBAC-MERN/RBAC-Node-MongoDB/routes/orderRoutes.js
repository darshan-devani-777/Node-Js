const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const {
  isAdminOrSuperAdmin,
  canManageUser,
} = require("../middlewares/rbacMiddleware");

// User: Create Order
router.post("/create", protect, orderController.createOrder);

// Admin/SuperAdmin: Get All Orders
router.get("/", protect, isAdminOrSuperAdmin, orderController.getAllOrders);

// Get Orders of a Specific User (with permission)
router.get("/specific/:id", protect, canManageUser, orderController.getUserOrders);

// User: Update their own order
router.put("/update-details/:id", protect, orderController.updateOrderDetails);

// User: Update Status 
router.put("/update-status/:id", protect, orderController.updateOrderStatus);

// User: Delete their own order
router.delete("/delete/:id", protect, orderController.deleteOrder);

module.exports = router;
