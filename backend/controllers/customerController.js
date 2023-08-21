const express = require("express");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");

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

const getAllProducts = (req, res) => {
  const query = "SELECT * FROM product";

  db.mysqlConnection.query(query, (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports = { registerCustomer, getAllProducts };
