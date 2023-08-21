const express = require("express");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const Category = require("../models/category");
const { all } = require("../routes/customer");
const session = require("express-session");

const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'warehouse_admin')";
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

const createCatagory = async (req, res) => {
  const { id, name } = req.body;

  const newCategory = await Category.create(
    { id: id, name: name },
    { new: true }
  );
  res.status(200).json(newCategory);
};

const getAllCatagories = async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { id: categoryId },
      { name },
      { new: true }
    ).exec();

    if (updatedCategory) {
      res
        .status(200)
        .json({ message: "Category updated", category: updatedCategory });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  req.session.categoryId = req.params.id;
  const getCategoryIDQuery = "SELECT DISTINCT category_id FROM product";
  const allProductCategory = [];

  db.mysqlConnection.query(getCategoryIDQuery, async (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error deleting product", error: error.message });
    } else {
      for (const category of result) {
        allProductCategory.push(category.category_id);
      }
      console.log(allProductCategory);

      if (allProductCategory.includes(parseInt(req.session.categoryId))) {
        res.status(403).send("There are products in this category");
      } else {
        try {
          const deleteCate = await Category.deleteOne(
            {
              id: parseInt(req.session.categoryId),
            },
            { new: true }
          ).exec();

          res.status(200).send("Delete successfully");
        } catch (error) {
          res.status(500).json({
            message: "Error deleting product",
            error: error.message,
          });
        }
      }
    }
  });
};
module.exports = {
  registerAdmin,
  createCatagory,
  getAllCatagories,
  updateCategory,
  deleteCategory,
};
