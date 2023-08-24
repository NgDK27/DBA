const express = require("express");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const Category = require("../models/category");

const registerCustomer = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'customer')";
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

const getCategoryName = async (categoryId) => {
  try {
    const category = await Category.findOne({ id: categoryId });
    return category.name;
  } catch (error) {
    console.error("Error fetching category name:", error);
    return null;
  }
};

const getAllProducts = async (req, res) => {
  const { minPrice, maxPrice, search, sortField, sortOrder } = req.query;

  let query =
    "SELECT p.product_id, p.title, p.description, p.price, p.image, p.category_id, SUM(i.quantity) AS available_quantity, u.username AS seller FROM product p JOIN inventory i ON p.product_id = i.product_id JOIN users u ON p.seller_id = u.user_id";
  const queryParams = [];

  // Add conditions to the query dynamically
  if (minPrice && maxPrice) {
    query += " WHERE price >= ? AND price <= ?";
    queryParams.push(parseInt(minPrice), parseInt(maxPrice));
  } else if (minPrice) {
    query += " WHERE price >= ?";
    queryParams.push(parseInt(minPrice));
  } else if (maxPrice) {
    query += " WHERE price <= ?";
    queryParams.push(parseInt(maxPrice));
  }

  if (search) {
    query += " WHERE (title LIKE ? OR description LIKE ?)";
    queryParams.push(`%${search}%`, `%${search}%`);
    query += " GROUP BY p.product_id, p.title, p.description, p.price, p.image";
  } else {
    query += " GROUP BY p.product_id, p.title, p.description, p.price, p.image";
  }

  // Add ORDER BY clause for sorting
  if (sortField && (sortOrder === "ASC" || sortOrder === "DESC")) {
    query += ` ORDER BY ${sortField} ${sortOrder}`;
  }

  db.mysqlConnection.query(query, queryParams, (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
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
            seller: product.seller,
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

module.exports = { registerCustomer, getAllProducts, getCategoryName };
