const express = require("express");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
const {
  registerSeller,
  createProduct,
} = require("../controllers/sellerController");
const { checkRole } = require("../middlewares/role");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

// Register a customer
router.route("/register").post(registerSeller);
router.post(
  "/createProduct",
  checkRole("seller"),
  upload.single("image"),
  createProduct
);

module.exports = router;
