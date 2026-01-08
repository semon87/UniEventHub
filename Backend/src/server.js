import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import moderatorRoutes from "./routes/moderatorRoutes.js";

// Load env vars
config();

// Connect to database
connectDB();
console.log("Database connected successfully");

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve static files
// Assuming server.js is in src/ and uploads is in Backend/uploads (one level up)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/moderator", moderatorRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Event Management System API is running",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
