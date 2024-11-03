const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Show form to create a new post
router.get("/create", (req, res) => {
  res.render("create_post");
});

// Handle creating a new post
router.post("/create", (req, res) => {
  const { title, content } = req.body;
  const user_id = req.session.user.id; // Get the current logged-in user ID

  db.query(
    "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
    [user_id, title, content],
    (err, result) => {
      if (err) {
        return res.render("create_post", { error: "Error creating post" });
      }
      res.redirect("/posts");
    }
  );
});

// List all posts
router.get("/", (req, res) => {
  db.query(
    "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id",
    (err, posts) => {
      if (err) {
        return res.render("posts", {
          error: "Error fetching posts",
          posts: [],
        });
      }
      res.render("posts", { posts });
    }
  );
});

module.exports = router;
