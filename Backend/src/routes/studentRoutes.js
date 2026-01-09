import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { protect, authorize } from "../middlewares/auth.js";
import { updateProfile } from "../controllers/studentController.js";

const router = express.Router();

import { storage } from "../config/cloudinary.js";

const upload = multer({ storage: storage });

// Routes
router.put("/profile", protect, authorize("student"), upload.single("profilePhoto"), updateProfile);

export default router;
