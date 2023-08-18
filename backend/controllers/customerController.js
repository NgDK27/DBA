const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({ secret: "your_secret_key", resave: true, saveUninitialized: true })
);

const registerCustomer = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log(req.body);
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

module.exports = { registerCustomer };
