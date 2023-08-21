const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerAdmin,
  createCatagory,
  getAllCatagories,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

// Register a customer
router.route("/register").post(registerAdmin);
router.post("/categories", checkRole("warehouse_admin"), createCatagory);
router.get("/categories", checkRole("warehouse_admin"), getAllCatagories);
router.put("/categories/:id", checkRole("warehouse_admin"), updateCategory);
router.delete("/categories/:id", checkRole("warehouse_admin"), deleteCategory);

module.exports = router;
