// Import the Express router to define route handlers
const router = require("express").Router();
// Import the User model for interacting with the users table in the database
const User = require("../models/users");
// Import bcryptjs for hashing and comparing passwords securely
const bcrypt = require("bcryptjs");
// Import jsonwebtoken for creating and verifying JWT tokens
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;
    // Check if a user with the given email already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // If user exists, return a 400 error with a message
      // status 400 indicates a bad request, often due to validation errors
      return res.status(400).json({ message: "Email already registered" });
    }
    // salt number is the number of rounds to use when hashing the password
    // each round has a cost associated with it, so a higher number means more security but also more processing time
    // Hash the user's password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    // hash functions return a string of length 60, which is the default length for bcrypt hashes
    // Create a new user in the database with the provided name, email, and hashed password
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    // Respond with a 201 status and the newly created user's info (excluding password)
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    // Handle any server errors and respond with a 500 status
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;
    // Find the user in the database by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // If user is not found, return a 400 error with a message
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords do not match, return a 400 error with a message
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token with the user's id and email as payload, using a secret key and 1 day expiration
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Respond with a success message and the generated token
    res.json({ message: "Login successful", token });
  } catch (err) {
    // Handle any server errors and respond with a 500 status
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;