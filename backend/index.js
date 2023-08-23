const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./dbconnection");
const login = require("./login");
const customerRoute = require("./routes/customer");
const adminRoute = require("./routes/admin");
const sellerRoute = require("./routes/seller");
const cors = require('cors')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(
  session({ secret: "your_secret_key", resave: true, saveUninitialized: true })
);

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

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(5001, () => {
      console.log(`mongodb running`);
    });
  })
  .catch((err) => console.log(err));

app.use("/", login);
app.use("/customers", customerRoute);
app.use("/admins", adminRoute);
app.use("/sellers", sellerRoute);

app.listen(8080, () => {
  console.log("Server running on 8080");
});
