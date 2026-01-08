import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an event title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide event description"],
      required: [true, "Please provide event description"],
    },
    eventType: {
      type: String,
      enum: ["Workshop", "Seminar", "Club Activity", "Competition", "Concert", "Sports", "Other"],
      default: "Other",
      required: true,
    },
    startDateTime: {
      type: Date,
      required: [true, "Please provide start date and time"],
    },
    endDateTime: {
      type: Date,
      required: [true, "Please provide end date and time"],
    },
    venue: {
      type: String,
      required: [true, "Please provide venue"],
      trim: true,
    },
    entryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    participantLimit: {
      type: Number,
      default: 0, // 0 means unlimited
      min: 0,
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000", // Default placeholder
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    interestedStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    goingStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching and filtering
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ startDateTime: 1 });
eventSchema.index({ organizer: 1 });

// Validate end date is after start date
eventSchema.pre("save", function (next) {
  if (this.endDateTime <= this.startDateTime) {
    next(new Error("End date and time must be after start date and time"));
  }
  next();
});

export default model("Event", eventSchema);
