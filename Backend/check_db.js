import mongoose from "mongoose";
import { config } from "dotenv";
import Student from "./src/models/Student.js";
import Club from "./src/models/Club.js";
import Event from "./src/models/Event.js";

config();

const checkDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to: ${conn.connection.name}`);

    const studentCount = await Student.countDocuments();
    const clubCount = await Club.countDocuments();
    const eventCount = await Event.countDocuments();

    const student = await Student.findOne();
    const club = await Club.findOne();
    const event = await Event.findOne();

    console.log("Sample Student Photo:", student?.profilePhoto);
    console.log("Sample Club Photo:", club?.profilePhoto);
    console.log("Sample Event Cover:", event?.coverImage);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDB();
