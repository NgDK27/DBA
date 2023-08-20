const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerSeller,
  createProduct,
} = require("../controllers/sellerController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

// Register a customer
router.route("/register").post(registerSeller);
router.route("/createProduct", checkRole("seller")).post(createProduct);

module.exports = router;
