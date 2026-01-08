import Club from "../models/Club.js";

// ... existing imports ... might need fs/path later if we do anything fancy, but generally covered by middleware

// @desc    Get club profile
// @route   GET /api/clubs/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const club = await Club.findById(req.user.id);
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update club profile
// @route   PUT /api/clubs/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const club = await Club.findById(req.user.id);
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }

    // Update fields
    if (req.body.name) club.name = req.body.name;
    if (req.body.description) club.description = req.body.description;
    
    // Handle file upload
    if (req.file) {
        club.profilePhoto = `uploads/${req.file.filename}`;
    }

    await club.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: club._id,
        name: club.name,
        email: club.email,
        description: club.description,
        profilePhoto: club.profilePhoto,
        role: "club"
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isApproved: true }).select("-password");
    res.status(200).json({ success: true, count: clubs.length, data: clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get club by ID
// @route   GET /api/clubs/:id
// @access  Public
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).select("-password").populate("events");
    if (!club) {
      return res.status(404).json({ success: false, message: "Club not found" });
    }
    res.status(200).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
