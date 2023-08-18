const express = require("express");
const session = require("express-session");
const db = require("./dbconnection");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();
app.use(
  session({
    secret: "my key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

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
          session.userId = user.user_id;
          session.role = user.role; // Store user role in session
          res.send(`hello ${session.role}`);
          console.log(session);
          res.status(200).send("Login successful");
        } else {
          res.status(401).send("Invalid credentials");
        }
      }
    });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};

router.route("/login").post(login);

module.exports = router;
