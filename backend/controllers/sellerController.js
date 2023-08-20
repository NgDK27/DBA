const express = require("express");
const db = require("../dbconnection");
const bcrypt = require("bcrypt");

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
      category_id: req.body.category_id,
    };
    console.log(data);
    let result = await db.mysqlConnection.query(
      "Insert into product set ? ",
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

module.exports = { registerSeller, createProduct };
