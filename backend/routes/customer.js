const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerCustomer,
  getAllProducts,
} = require("../controllers/customerController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

// Register a customer
router.route("/register").post(registerCustomer);
router.get("/getAllProducts", checkRole("customer"), getAllProducts);

module.exports = router;
