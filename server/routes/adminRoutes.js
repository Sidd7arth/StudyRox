const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin Dashboard" });
  }
);

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

module.exports = router;