const express = require("express");
const db = require("./dbconnection");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();
const fs = require("fs");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE username = ?";
    db.mysqlConnection.query(query, [username], async (error, results) => {
      if (error) {
        res.status(500).send("Error logging in");
      } else if (results.length === 0) {
        res.status(401).send("User not found");
      } else {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          req.session.userid = user.user_id;
          req.session.role = user.role; // Store user role in session
          res.status(201).send(`hello ${req.session.role}`);
          console.log(req.session);
        } else {
          res.status(401).send("Invalid credentials");
        }
      }
    });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/login"); // Redirect the user after logout
    }
    console.log(req.session);
  });
};

const images = (req, res) => {
  var filename = req.params.id;
  fs.readFile("./images/" + filename, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.contentType("image/jpeg");
      res.send(data);
    }
  });
};

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/images/:id").get(images);

module.exports = router;
