import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Student from "./src/models/Student.js";
import Club from "./src/models/Club.js";
import Event from "./src/models/Event.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFolder = path.join(__dirname, "uploads");

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const migrate = async () => {
    await connectDB();

    // Get all files
    const files = fs.readdirSync(uploadFolder);
    console.log(`Found ${files.length} files to process.`);

    for (const file of files) {
        if (file === '.gitkeep') continue;

        const filePath = path.join(uploadFolder, file);
        
        // Escape special regex chars in filename just in case
        const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Match the filename at the end of the string, allowing for any path separators before it
        // This matches "uploads\file.jpg" AND "uploads/file.jpg" AND just "file.jpg"
        const searchRegex = new RegExp(escapedFile + "$", 'i'); 

        console.log(`Processing: ${file}`);

        try {
            // Check matches first
            const students = await Student.find({ profilePhoto: searchRegex });
            const clubs = await Club.find({ profilePhoto: searchRegex });
            const events = await Event.find({ coverImage: searchRegex });

            const totalMatches = students.length + clubs.length + events.length;
            
            if (totalMatches === 0) {
                console.log(`  [SKIP] No database record found for ${file}`);
                continue; 
            } else {
                 console.log(`  [MATCH] Found ${totalMatches} records to update.`);
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "uni-event-hub",
                use_filename: true,
                unique_filename: false,
                overwrite: true // Overwrite this time to ensure we get the URL
            });

            const secureUrl = result.secure_url;
            console.log(`  [UPLOADED] to ${secureUrl}`);

            // Update Database Records
            for (const student of students) {
                student.profilePhoto = secureUrl;
                await student.save();
                console.log(`  [UPDATED] Student ${student.studentId}`);
            }

            for (const club of clubs) {
                club.profilePhoto = secureUrl;
                await club.save();
                console.log(`  [UPDATED] Club ${club.name}`);
            }

            for (const event of events) {
                event.coverImage = secureUrl;
                await event.save();
                console.log(`  [UPDATED] Event ${event.title}`);
            }

        } catch (error) {
            console.error(`  [ERROR] Failed to process ${file}:`, error.message);
        }
    }

    console.log("Migration completed.");
    process.exit();
};

migrate();
