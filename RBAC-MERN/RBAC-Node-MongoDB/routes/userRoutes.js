const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { canManageUser, isAdminOrSuperAdmin , isSuperAdmin } = require("../middlewares/rbacMiddleware");

const {
  getAllUsers,
  getAllRoles,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");

// (All roles: user/admin/superadmin)
router.get("/:id", protect, canManageUser, getUserById);
router.put("/:id", protect, canManageUser, updateUserById);
router.delete("/:id", protect, canManageUser, deleteUserById);

// Admin/Superadmin Only
router.get("/", protect, isAdminOrSuperAdmin, getAllUsers);
router.get("/role", protect , isSuperAdmin, getAllRoles);

module.exports = router;
