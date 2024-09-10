const jwt = require("jsonwebtoken");
const User = require("../models/users.js");

// Middleware to check for authentication and role-based access
const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the database
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ msg: "User not found" });
      }

      // Check if the user's role is included in the required roles
      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      // Proceed to the next middleware/handler
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

module.exports = authMiddleware;
