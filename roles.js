const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Middleware to ensure only admin can access
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role_id === 1) {
    // Assuming role_id 1 is admin
    next();
  } else {
    res.redirect("/auth/login");
  }
};

// Show all users and their roles
router.get("/manage", isAdmin, (req, res) => {
  db.query(
    "SELECT users.*, roles.role_name FROM users JOIN roles ON users.role_id = roles.id",
    (err, users) => {
      if (err) {
        return res.render("manage_roles", {
          error: "Error fetching users and roles",
          users: [],
        });
      }
      db.query("SELECT * FROM roles", (err, roles) => {
        if (err) {
          return res.render("manage_roles", {
            error: "Error fetching roles",
            users,
          });
        }
        res.render("manage_roles", { users, roles });
      });
    }
  );
});

// Change user role
router.post("/change-role", isAdmin, (req, res) => {
  const { user_id, role_id } = req.body;

  db.query(
    "UPDATE users SET role_id = ? WHERE id = ?",
    [role_id, user_id],
    (err, result) => {
      if (err) {
        return res.redirect("/roles/manage");
      }
      res.redirect("/roles/manage");
    }
  );
});

module.exports = router;
