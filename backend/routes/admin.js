const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerAdmin,
  createCatagory,
  getAllCatagories,
  updateCategory,
  deleteCategory,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  createInventory,
} = require("../controllers/adminController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

router.route("/register").post(registerAdmin);
router.post("/categories", checkRole("warehouse_admin"), createCatagory);
router.get("/categories", checkRole("warehouse_admin"), getAllCatagories);
router.put("/categories/:id", checkRole("warehouse_admin"), updateCategory);
router.delete("/categories/:id", checkRole("warehouse_admin"), deleteCategory);

router.post("/warehouses", checkRole("warehouse_admin"), createWarehouse);
router.put("/warehouses/:id", checkRole("warehouse_admin"), updateWarehouse);
router.delete("/warehouses/", checkRole("warehouse_admin"), deleteWarehouse);

router.post("/inventory", checkRole("warehouse_admin"), createInventory);

module.exports = router;
