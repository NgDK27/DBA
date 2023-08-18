const mysql = require("mysql");
const mongoose = require("mongoose");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "dba",
});

module.exports = { mysqlConnection };
