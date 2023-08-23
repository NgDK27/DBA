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
  getAllWarehouses,
  getWarehouse,
  moveProducts,
} = require("../controllers/adminController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

router.route("/register").post(registerAdmin);
router.post("/categories", checkRole("warehouse_admin"), createCatagory);
router.get("/categories", checkRole("warehouse_admin"), getAllCatagories);
router.put("/categories/:id", checkRole("warehouse_admin"), updateCategory);
router.delete("/categories/:id", checkRole("warehouse_admin"), deleteCategory);

router.post("/warehouses", checkRole("warehouse_admin"), createWarehouse);
router.get("/warehouses", checkRole("warehouse_admin"), getAllWarehouses);
router.get("/warehouses/:id", checkRole("warehouse_admin"), getWarehouse);
router.put("/warehouses/:id", checkRole("warehouse_admin"), updateWarehouse);
router.delete("/warehouses/", checkRole("warehouse_admin"), deleteWarehouse);
router.post("/moveProducts", checkRole("warehouse_admin"), moveProducts);

router.post("/inventory", checkRole("warehouse_admin"), createInventory);

module.exports = router;
