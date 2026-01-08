import Moderator from "../models/Moderator.js";
import Club from "../models/Club.js";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT for moderator
const generateToken = (id) => {
  return jwt.sign({ id, role: "moderator" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Moderator Login
// @route   POST /api/moderator/login
// @access  Public
export const loginModerator = async (req, res) => {
  const { email, password } = req.body;

  try {
    const moderator = await Moderator.findOne({ email }).select("+password");

    if (moderator && (await moderator.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(moderator._id),
        user: {
          id: moderator._id,
          email: moderator.email,
          role: "moderator",
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get pending clubs
// @route   GET /api/moderator/clubs/pending
// @access  Private (Moderator)
export const getPendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isApproved: false });
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Approve or Decline Club
// @route   PUT /api/moderator/clubs/:id
// @access  Private (Moderator)
export const updateClubStatus = async (req, res) => {
  const { status } = req.body; // status: 'approved' or 'rejected'
  // For now we only support approving, if rejected we might delete or just mark rejected.
  // Requirement says "approaving the club registration first then the club can be register".
  // So we probably just flip isApproved to true.
  
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (status === "approved") {
      club.isApproved = true;
      await club.save();
      res.status(200).json({ message: "Club approved successfully", club });
    } else if (status === "rejected") {
        // Option: Delete the registration if rejected
        await Club.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Club rejected and removed" });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get pending events
// @route   GET /api/moderator/events/pending
// @access  Private (Moderator)
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false }).populate("organizer", "name");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Approve or Decline Event
// @route   PUT /api/moderator/events/:id
// @access  Private (Moderator)
export const updateEventStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (status === "approved") {
      event.isApproved = true;
      event.status = "approved";
      await event.save();
      res.status(200).json({ message: "Event approved successfully", event });
    } else if (status === "rejected") {
        event.isApproved = false;
        event.status = "rejected";
        await event.save();
        res.status(200).json({ message: "Event rejected" });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
