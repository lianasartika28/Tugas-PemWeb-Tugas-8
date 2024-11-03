const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const roleRoutes = require("./routes/roles");
const rentalRoutes = require("./routes/rentals"); // Import rentals routes
const path = require("path");

const app = express();

// Set EJS as the template engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret", // Change this to a secure secret in production
    resave: false,
    saveUninitialized: true,
  })
);

// Set static folder for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to check login status
app.use((req, res, next) => {
  const publicRoutes = ["/auth/login", "/auth/register"];

  // If the user is not logged in and trying to access protected pages, redirect to login
  if (!req.session.user && !publicRoutes.includes(req.path)) {
    return res.redirect("/auth/login");
  }

  // If the user is logged in and tries to access the root route, redirect to profile
  if (req.session.user && req.path === "/") {
    return res.redirect("/auth/profile");
  }

  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/roles", roleRoutes);
app.use("/rentals", rentalRoutes); // Adding rentals routes

// Root Route: Redirect to /auth/login or /auth/profile based on session
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/auth/profile");
  } else {
    return res.redirect("/auth/login");
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
