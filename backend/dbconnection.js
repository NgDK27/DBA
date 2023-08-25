const mysql = require("mysql");

const mysqlConnection = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "password",
  database: "dba",
});

module.exports = { mysqlConnection };
