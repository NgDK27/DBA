const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./dbconnection");
const login = require("./login");
const customerRoute = require("./routes/customer");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

db.mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
  }
});

app.use("/", login);
app.use("/customers", customerRoute);

app.listen(8080, () => {
  console.log("Server running on 8080");
});
