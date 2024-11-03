const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your DB username
  password: "", // Replace with your DB password
  database: "user_management", // Replace with your DB name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = db;
