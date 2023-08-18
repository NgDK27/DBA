const express = require("express");
const cookieParser = require("cookie-parser");
const { registerCustomer } = require("../controllers/customerController");
const router = express.Router();

// Register a customer
router.route("/register").post(registerCustomer);

module.exports = router;
