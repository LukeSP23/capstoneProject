// Import jsonwebtoken to verify JWT tokens
const jwt = require("jsonwebtoken");

// Middleware to authenticate requests using JWT
function verifyToken(req, res, next) {
 // Get the token from the request headers
  const token = req.headers["x-authentication-token"];
  console.log("Request Headers:", req.headers);
  console.log("Token:", token);

  // If no token is provided, deny access
  if (!token) {
       return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // Attach the decoded user info to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If token is invalid or expired, deny access
    res.status(403).json({ message: "Invalid or expired token." });
  }
}

module.exports = verifyToken;