const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Middleware to check if a user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

// Render the rentals page (list of rentals)
router.get("/", isAuthenticated, (req, res) => {
  const query = `
    SELECT rentals.*, users.username 
    FROM rentals 
    JOIN users ON rentals.user_id = users.id
  `;
  db.query(query, (err, rentals) => {
    if (err) throw err;
    res.render("rentals", { rentals });
  });
});

// Render the create rental form
router.get("/create", isAuthenticated, (req, res) => {
  res.render("createRental"); // Ensure you have createRental.ejs
});

// Process rental creation
router.post("/create", isAuthenticated, (req, res) => {
  const { title, description, price, size } = req.body;
  const query =
    "INSERT INTO rentals (title, description, price, size, user_id) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [title, description, price, size, req.session.user.id],
    (err, result) => {
      if (err) throw err;
      res.redirect("/rentals");
    }
  );
});

// Render a specific rental's details
router.get("/:id", isAuthenticated, (req, res) => {
  const query =
    "SELECT rentals.*, users.username FROM rentals JOIN users ON rentals.user_id = users.id WHERE rentals.id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).send("Rental not found");
    }
    res.render("rentalDetails", { rental: result[0] }); // Ensure you have rentalDetails.ejs
  });
});

// Render the edit rental form
router.get("/:id/edit", isAuthenticated, (req, res) => {
  const query =
    "SELECT rentals.*, users.username FROM rentals JOIN users ON rentals.user_id = users.id WHERE rentals.id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).send("Rental not found");
    }
    res.render("editRental", { rental: result[0] }); // Ensure you have editRental.ejs
  });
});

// Process rental update
router.post("/:id/edit", isAuthenticated, (req, res) => {
  const { title, description, price, size } = req.body;
  const query =
    "UPDATE rentals SET title = ?, description = ?, price = ?, size = ? WHERE id = ?";

  db.query(
    query,
    [title, description, price, size, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.redirect("/rentals");
    }
  );
});

// Process rental deletion
router.post("/:id/delete", isAuthenticated, (req, res) => {
  const query = "DELETE FROM rentals WHERE id = ?";

  db.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect("/rentals");
  });
});

module.exports = router;
