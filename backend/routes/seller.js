const express = require("express");
const cookieParser = require("cookie-parser");
const { registerSeller } = require("../controllers/sellerController");
const router = express.Router();

// Register a customer
router.route("/register").post(registerSeller);

module.exports = router;
