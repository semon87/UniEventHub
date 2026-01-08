import { body, validationResult } from "express-validator";

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  console.log("Validation passed");
  next();
};

// Student registration validation
export const studentRegisterValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("studentId").trim().notEmpty().withMessage("Student ID is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("batch").trim().notEmpty().withMessage("Batch is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Club registration validation
export const clubRegisterValidation = [
  body("name").trim().notEmpty().withMessage("Club name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

// Login validation
export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Event validation
export const eventValidation = [
  body("title").trim().notEmpty().withMessage("Event title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("startDateTime")
    .isISO8601()
    .withMessage("Please provide valid start date and time"),
  body("endDateTime")
    .isISO8601()
    .withMessage("Please provide valid end date and time"),
  body("venue").trim().notEmpty().withMessage("Venue is required"),
];
