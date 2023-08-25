const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerCustomer,
  getAllProducts,
  getProduct,
  addCart,
} = require("../controllers/customerController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

// Register a customer
router.route("/register").post(registerCustomer);
router.get("/getAllProducts", checkRole("customer"), getAllProducts);
router.get("/getProduct/:id", checkRole("customer"), getProduct);
router.post("/addCart", checkRole("customer"), addCart);

module.exports = router;
