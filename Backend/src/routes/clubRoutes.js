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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


router.get("/", getAllClubs);
router.get("/:id", getClubById);

// Protected routes (Club only)
router.use(protect, authorize("club"));

router.route("/profile")
  .get(getProfile)
  .put(upload.single("profilePhoto"), updateProfile);

export default router;
