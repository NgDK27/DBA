const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./dbconnection");
const customerRoute = require("./routes/customer");

const app = express();
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

app.use("/customers", customerRoute);

app.listen(8080, () => {
  console.log("Server running on 8080");
});
