import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./src/models/Student.js";
import Club from "./src/models/Club.js";
import Event from "./src/models/Event.js";
import Moderator from "./src/models/Moderator.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/uni-event-hub");
    console.log("MongoDB Connected for seeding");

    // Clear existing data
    await Student.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await Moderator.deleteMany({});
    console.log("Cleared existing data");

    // Create Clubs
    const clubs = await Club.create([
      {
        name: "Coding Club",
        email: "coding@uni.edu",
        password: "password123",
        description: "A club for coding enthusiasts to learn and build together.",
        isApproved: true,
      },
      {
        name: "Music Club",
        email: "music@uni.edu",
        password: "password123",
        description: "Coordinate musical events and jam sessions.",
        isApproved: true,
      },
    ]);
    console.log(`Created ${clubs.length} clubs`);

    // Create Students
    const students = await Student.create([
      {
        name: "Alice Johnson",
        studentId: "S101",
        department: "CS",
        batch: "2024",
        email: "alice@uni.edu",
        password: "password123",
      },
      {
        name: "Bob Smith",
        studentId: "S102",
        department: "EE",
        batch: "2023",
        email: "bob@uni.edu",
        password: "password123",
      },
      {
        name: "Charlie Brown",
        studentId: "S103",
        department: "ME",
        batch: "2025",
        email: "charlie@uni.edu",
        password: "password123",
      },
      {
        name: "Diana Prince",
        studentId: "S104",
        department: "CS",
        batch: "2024",
        email: "diana@uni.edu",
        password: "password123",
      },
      {
        name: "Evan Wright",
        studentId: "S105",
        department: "BBA",
        batch: "2026",
        email: "evan@uni.edu",
        password: "password123",
      },
      {
        name: "Fiona Gallagher",
        studentId: "S106",
        department: "CS",
        batch: "2025",
        email: "fiona@uni.edu",
        password: "password123",
      },
    ]);
    console.log(`Created ${students.length} students`);

    // Create Events
    const events = await Event.create([
      {
        title: "Hackathon 2025",
        description: "Annual coding hackathon for all departments.",
        startDateTime: new Date("2025-05-15T09:00:00"),
        endDateTime: new Date("2025-05-16T18:00:00"),
        venue: "Main Auditorium",
        organizer: clubs[0]._id, // Coding Club
        status: "approved",
        isApproved: true,
        eventType: "Competition",
      },
      {
        title: "Intro to Python Workshop",
        description: "Beginner friendly Python workshop.",
        startDateTime: new Date("2025-04-10T14:00:00"),
        endDateTime: new Date("2025-04-10T17:00:00"),
        venue: "Lab 3",
        organizer: clubs[0]._id, // Coding Club
        status: "approved",
        isApproved: true,
      },
      {
        title: "Spring Concert",
        description: "Live performances by student bands.",
        startDateTime: new Date("2025-06-20T18:00:00"),
        endDateTime: new Date("2025-06-20T22:00:00"),
        venue: "Open Grounds",
        organizer: clubs[1]._id, // Music Club
        status: "pending",
        isApproved: false,
        eventType: "Concert",
      },
    ]);
    console.log(`Created ${events.length} events`);

    // Link events to clubs (optional, if schema requires bi-directional sync, but models didn't enforce it strictly in save, though good to have)
    // Note: The Club model has an 'events' array. We should populate it.
    await Club.findByIdAndUpdate(clubs[0]._id, { $push: { events: [events[0]._id, events[1]._id] } });
    await Club.findByIdAndUpdate(clubs[1]._id, { $push: { events: [events[2]._id] } });
    console.log("Linked events to clubs");

    // Create Moderator
    await Moderator.create({
      email: "mod@uni.edu",
      password: "password123",
    });
    console.log("Created moderator");

    console.log("Data seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
