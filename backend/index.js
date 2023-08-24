const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const https = require("https");
const helmet = require("helmet");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./dbconnection");
const login = require("./login");
const customerRoute = require("./routes/customer");
const adminRoute = require("./routes/admin");
const sellerRoute = require("./routes/seller");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  session({
    secret: "your_secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, // Set to true when using HTTPS
      httpOnly: true,
    },
  })
);

db.mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
  }
});

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure) {
    // Redirect to HTTPS version of the same URL
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    return res.redirect(301, httpsUrl);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/", login);
app.use("/customers", customerRoute);
app.use("/admins", adminRoute);
app.use("/sellers", sellerRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(5000, () => {
      console.log(`mongodb running`);
    });
  })
  .catch((err) => console.log(err));

// Set up HTTPS server
const options = {
  key: fs.readFileSync("./security/private.key", "utf-8"),
  cert: fs.readFileSync("./security/certificate.crt", "utf8"),
};

https.createServer(options, app).listen(443, () => {
  console.log("Server running on port 443 (HTTPS)");
});
