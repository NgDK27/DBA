const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerCustomer,
  getAllProducts,
  getProduct,
} = require("../controllers/customerController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

// Register a customer
router.route("/register").post(registerCustomer);
router.get("/getAllProducts", checkRole("customer"), getAllProducts);
router.get("/getProduct/:id", checkRole("customer"), getProduct);

module.exports = router;
