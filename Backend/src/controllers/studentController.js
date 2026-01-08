import Student from "../models/Student.js";
import fs from "fs";
import path from "path";

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
export const updateProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Update text fields
    if (req.body.name) student.name = req.body.name;
    if (req.body.studentId) student.studentId = req.body.studentId;
    if (req.body.department) student.department = req.body.department;
    if (req.body.batch) student.batch = req.body.batch;

    // Handle file upload
    if (req.file) {
      // Delete old photo if it exists (optional, keeping it simple for now)
      // Save relative path
      student.profilePhoto = `uploads/${req.file.filename}`;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        department: student.department,
        batch: student.batch,
        profilePhoto: student.profilePhoto, // Return new photo URL
        role: "student",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
