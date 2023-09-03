const express = require("express");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
const {
  registerSeller,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  sendInboundOrder,
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

router.route("/register").post(registerSeller);
router.post(
  "/createProduct",
  checkRole("seller"),
  upload.single("image"),
  createProduct
);
router.put("/products/:id", checkRole("seller"), updateProduct);
router.delete("/products/:id", checkRole("seller"), deleteProduct);
router.get("/getAllProducts", checkRole("seller"), getAllProducts);
router.get("/getProduct/:id", checkRole("seller"), getProduct);
router.post("/sendInbound", checkRole("seller"), sendInboundOrder);

module.exports = router;
