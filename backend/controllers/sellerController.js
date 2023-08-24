const express = require("express");
const path = require("path");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { getCategoryName } = require("./customerController");

const registerSeller = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'seller')";
    db.mysqlConnection.query(
      query,
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          res.status(500).send("Error registering user");
        } else {
          res.status(201).send("Registration successful");
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Error registering user");
  }
};

const createProduct = async (req, res) => {
  try {
    var data = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename,
      length: req.body.length,
      width: req.body.width,
      height: req.body.height,
      seller_id: req.session.userid,
      category_id: req.body.category_id,
      added_time: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    console.log(data);
    let result = await db.mysqlConnection.query(
      "INSERT INTO product ST ? ",
      [data],
      function (err, rows) {
        if (err) {
          res.send({
            message: "Error",
            err,
          });
        } else {
          res.send("success");
        }
      }
    );
  } catch (error) {}
};

const getAllProducts = async (req, res) => {
  const sellerId = req.session.userid;
  console.log(sellerId);
  const query =
    "SELECT p.product_id, p.title, p.description, p.price, p.image, p.category_id FROM product p WHERE p.seller_id = ?";
  db.mysqlConnection.query(query, sellerId, (error, results) => {
    console.log(query);
    if (error) {
      return res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    } else {
      const getProductData = async (results) => {
        const productData = [];

        for (const product of results) {
          const category = await getCategoryName(product.category_id);
          productData.push({
            product_id: product.product_id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: category,
          });
        }

        return productData;
      };

      getProductData(results)
        .then((productData) => {
          console.log(productData);
          res.status(200).json(productData);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          res
            .status(500)
            .json({ message: "Error fetching products", error: error.message });
        });
    }
  });
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  const query =
    "SELECT p.product_id, p.title, p.description, p.price, p.image, p.category_id, SUM(i.quantity) AS available_quantity, u.username AS seller FROM product p LEFT JOIN inventory i ON p.product_id = i.product_id JOIN users u ON p.seller_id = u.user_id WHERE p.product_id = ? GROUP BY p.product_id, p.title, p.description, p.price, p.image";
  db.mysqlConnection.query(query, productId, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    } else {
      const getProductData = async (results) => {
        const productData = [];

        for (const product of results) {
          const category = await getCategoryName(product.category_id);
          productData.push({
            product_id: product.product_id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: category,
            quantity: product.available_quantity,
          });
        }

        return productData;
      };

      getProductData(results)
        .then((productData) => {
          console.log(productData);
          res.status(200).json(productData);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          res
            .status(500)
            .json({ message: "Error fetching products", error: error.message });
        });
    }
  });
};

const updateProduct = (req, res) => {
  const productId = req.params.id;
  const { title, description, price, length, width, height, category_id } =
    req.body;

  const updateFields = [];
  const updateValues = [];

  if (title) {
    updateFields.push("title = ?");
    updateValues.push(title);
  }
  if (description) {
    updateFields.push("description = ?");
    updateValues.push(description);
  }
  if (price) {
    updateFields.push("price = ?");
    updateValues.push(price);
  }

  if (updateFields.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid fields provided for update" });
  }

  const updateQuery = `
    UPDATE product
    SET ${updateFields.join(", ")}
    WHERE product_id = ? AND seller_id = ?`;

  updateValues.push(productId);
  updateValues.push(req.session.userid);

  db.mysqlConnection.query(updateQuery, updateValues, (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product updated successfully" });
    }
  });
};

const deleteProduct = (req, res) => {
  const productId = req.params.id;

  // Fetch the image filename before deleting the product
  const getImageFilenameQuery =
    "SELECT image FROM product WHERE product_id = ? AND seller_id = ?";
  db.mysqlConnection.query(
    getImageFilenameQuery,
    [productId, req.session.userid],
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error deleting product", error: error.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const imageFilename = result[0].image;

      // Delete product
      const deleteQuery =
        "DELETE FROM product WHERE product_id = ? AND seller_id = ?";
      db.mysqlConnection.query(
        deleteQuery,
        [productId, req.session.userid],
        (deleteError, deleteResult) => {
          if (deleteError) {
            return res.status(500).json({
              message: "Error deleting product",
              error: deleteError.message,
            });
          }

          if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
          }

          // Remove the image file from the server
          if (imageFilename) {
            const imagePath = path.join(__dirname, "../images", imageFilename);
            fs.unlink(imagePath, (error) => {
              if (error) {
                console.error("Error deleting image:", error);
              }
              res
                .status(200)
                .json({ message: "Product and image deleted successfully" });
            });
          } else {
            res.status(200).json({ message: "Product deleted successfully" });
          }
        }
      );
    }
  );
};

module.exports = {
  registerSeller,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
};
