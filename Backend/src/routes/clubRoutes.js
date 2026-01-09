import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  getProfile,
  updateProfile,
  getAllClubs,
  getClubById,
} from "../controllers/clubController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

// Configure Multer
import { storage } from "../config/cloudinary.js";

const upload = multer({ storage: storage });


router.get("/", getAllClubs);
router.get("/:id", getClubById);

// Protected routes (Club only)
router.use(protect, authorize("club"));

router.route("/profile")
  .get(getProfile)
  .put(upload.single("profilePhoto"), updateProfile);

export default router;
