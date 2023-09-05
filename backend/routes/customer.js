const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerCustomer,
  getAllProducts,
  getProduct,
  addCart,
  placeOrder,
  getAllOrders,
  getOrder,
  updateStatus,
  getAllCategories,
} = require("../controllers/customerController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

router.route("/register").post(registerCustomer);
router.get("/categories", checkRole("customer"), getAllCategories);
router.get("/getAllProducts", checkRole("customer"), getAllProducts);
router.get("/getProduct/:id", checkRole("customer"), getProduct);
router.get("/getAllOrders", checkRole("customer"), getAllOrders);
router.get("/getOrder/:id", checkRole("customer"), getOrder);
router.post("/addCart", checkRole("customer"), addCart);
router.post("/placeOrder", checkRole("customer"), placeOrder);
router.put("/updateStatus/:id", checkRole("customer"), updateStatus);

module.exports = router;
