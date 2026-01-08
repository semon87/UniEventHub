import jwt from "jsonwebtoken"; // Changed to default import for cleaner code
import Student from "../models/Student.js";
import Club from "../models/Club.js";

const { sign } = jwt;

// Generate JWT Token
const generateToken = (id, role) => {
  return sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register student
// @route   POST /api/auth/student/register
// @access  Public
export async function registerStudent(req, res) {
  try {
    const { name, studentId, department, batch, email, password } = req.body;

    // Check if student exists
    const studentExists = await Student.findOne({
      $or: [{ email }, { studentId }],
    });
    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student with this email or student ID already exists",
      });
    }

    // Create student
    const student = await Student.create({
      name,
      studentId,
      department,
      batch,
      email,
      password,
    });

    const token = generateToken(student._id, "student");

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      user: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        department: student.department,
        batch: student.batch,
        role: "student",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Register club
// @route   POST /api/auth/club/register
// @access  Public
export async function registerClub(req, res) {
  try {
    const { name, email, password, description } = req.body;

    // Check if club exists
    const clubExists = await Club.findOne({ $or: [{ email }, { name }] });
    if (clubExists) {
      return res.status(400).json({
        success: false,
        message: "Club with this email or name already exists",
      });
    }

    // Create club
    const club = await Club.create({
      name,
      email,
      password,
      description,
    });

    const token = generateToken(club._id, "club");

    res.status(201).json({
      success: true,
      message: "Club registered successfully",
      token,
      user: {
        id: club._id,
        name: club.name,
        email: club.email,
        description: club.description,
        role: "club",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Login student
// @route   POST /api/auth/student/login
// @access  Public
export async function loginStudent(req, res) {
  try {
    const { email, password } = req.body;

    // Check for student
    const student = await Student.findOne({ email }).select("+password");
    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(student._id, "student");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        department: student.department,
        batch: student.batch,
        profilePhoto: student.profilePhoto,
        role: "student",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// @desc    Login club
// @route   POST /api/auth/club/login
// @access  Public
export async function loginClub(req, res) {
  try {
    const { email, password } = req.body;

    // Check for club
    const club = await Club.findOne({ email }).select("+password");
    if (!club) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await club.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!club.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Account pending approval from university moderator",
      });
    }

    const token = generateToken(club._id, "club");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: club._id,
        name: club.name,
        email: club.email,
        description: club.description,
        profilePhoto: club.profilePhoto,
        role: "club",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
