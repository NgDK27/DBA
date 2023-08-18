const express = require("express");
const cookieParser = require("cookie-parser");
const { registerCustomer, alo } = require("../controllers/customerController");
const router = express.Router();

// Register a customer
router.route("/register").post(registerCustomer);
router.route("/test").get(alo);

module.exports = router;
