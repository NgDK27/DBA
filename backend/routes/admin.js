const express = require("express");
const cookieParser = require("cookie-parser");
const { registerAdmin } = require("../controllers/adminController");
const router = express.Router();

// Register a customer
router.route("/register").post(registerAdmin);

module.exports = router;
