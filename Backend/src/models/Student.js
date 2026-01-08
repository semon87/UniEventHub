import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"; // FIXED: Import default

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    studentId: {
      type: String,
      required: [true, "Please provide a student ID"],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Please provide a department"],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, "Please provide a batch"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    profilePhoto: {
      type: String, // URL/path to the image
      default: "",
    },
    interestedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    goingEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // FIXED
  this.password = await bcrypt.hash(this.password, salt); // FIXED
});

// Compare password method
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // FIXED
};

export default model("Student", studentSchema);
