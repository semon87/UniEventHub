import { Router } from "express";
import {
  loginModerator,
  getPendingClubs,
  updateClubStatus,
  getPendingEvents,
  updateEventStatus,
} from "../controllers/moderatorController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

// Public routes
router.post("/login", loginModerator);

// Protected routes (Moderator only)
router.use(protect, authorize("moderator"));

router.get("/clubs/pending", getPendingClubs);
router.put("/clubs/:id", updateClubStatus);

router.get("/events/pending", getPendingEvents);
router.put("/events/:id", updateEventStatus);

export default router;
