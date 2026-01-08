import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
  joinEvent,
  leaveEvent,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middlewares/auth.js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { eventValidation, validate } from "../middlewares/validation.js";

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

const router = Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEvent);

// Protected routes (Club only)
router.post(
  "/",
  protect,
  authorize("club"),
  upload.single("coverImage"),
  eventValidation,
  validate,
  createEvent
);
router.put("/:id", protect, authorize("club"), upload.single("coverImage"), updateEvent);
router.delete("/:id", protect, authorize("club"), deleteEvent);
router.get("/:id/attendees", protect, authorize("club"), getEventAttendees);
router.post("/:id/join", protect, authorize("student"), joinEvent);
router.post("/:id/leave", protect, authorize("student"), leaveEvent);

export default router;
