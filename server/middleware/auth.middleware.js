const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error.util.js");

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Access denied. No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    next(createError(401, "Invalid token"));
  }
};

// Verify admin role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "owner") {
    return next(createError(403, "Access denied. Admin role required"));
  }
  next();
};

// Verify owner role
const verifyOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return next(createError(403, "Access denied. Owner role required"));
  }
  next();
};

// Verify client role
const verifyClient = (req, res, next) => {
  if (req.user.role !== "client" && req.user.role !== "admin" && req.user.role !== "owner") {
    return next(createError(403, "Access denied. Client role required"));
  }
  next();
};

// Verify user is accessing their own resources
const verifyOwnership = (paramIdField) => {
  return (req, res, next) => {
    const resourceId = req.params[paramIdField];
    
    if (req.user.role === "admin" || req.user.role === "owner") {
      // Admins and owners can access any resource
      return next();
    }
    
    if (req.user.id !== resourceId) {
      return next(createError(403, "Access denied. You can only access your own resources"));
    }
    
    next();
  };
};

// Verify admin access for client management
const verifyAdminForClientManagement = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "owner") {
    return next(createError(403, "Access denied. Admin role required for client management"));
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyOwner,
  verifyClient,
  verifyOwnership,
  verifyAdminForClientManagement
};
