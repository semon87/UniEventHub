import jwt from "jsonwebtoken";
// Note: Ensure you include the .js extension for local imports
import Student from "../models/Student.js";
import Club from "../models/Club.js";
import Moderator from "../models/Moderator.js";
import express from "express";



// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is student, club or moderator
    if (decoded.role === "student") {
      req.user = await Student.findById(decoded.id);
      req.userRole = "student";
    } else if (decoded.role === "club") {
      req.user = await Club.findById(decoded.id);
      req.userRole = "club";
    } else if (decoded.role === "moderator") {
      req.user = await Moderator.findById(decoded.id);
      req.userRole = "moderator";
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error(error); // Helpful to log the actual error for debugging
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.userRole} is not authorized to access this route`,
      });
    }
    next();
  };
};
