import { Router } from "express";
import { protect } from "../middlewares/auth.js"; 

import {
  registerStudent,
  registerClub,
  loginStudent,
  loginClub,
} from "../controllers/authController.js";
import {
  studentRegisterValidation,
  clubRegisterValidation,
  loginValidation,
  validate,
} from "../middlewares/validation.js";

const router = Router();
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    role: req.userRole,
  });
});
// Student routes
router.post(
  "/student/register",
  studentRegisterValidation,
  validate,
  registerStudent
);
router.post("/student/login", loginValidation, validate, loginStudent);

// Club routes
router.post("/club/register", clubRegisterValidation, validate, registerClub);
router.post("/club/login", loginValidation, validate, loginClub);

export default router;

