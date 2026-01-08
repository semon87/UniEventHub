import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"; // FIXED: Import default

const clubSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a club name"],
      unique: true,
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
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    description: {
      type: String,
      required: [true, "Please provide a club description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
clubSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // FIXED: Use bcrypt.genSalt
  this.password = await bcrypt.hash(this.password, salt); // FIXED: Use bcrypt.hash
});

// Compare password method
clubSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // FIXED: Use bcrypt.compare
};

export default model("Club", clubSchema);
