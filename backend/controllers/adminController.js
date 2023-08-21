const express = require("express");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const Category = require("../models/category");

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

  const newCategory = await Category.create({ id: id, name: name });
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

module.exports = {
  registerAdmin,
  createCatagory,
  getAllCatagories,
  updateCategory,
};
