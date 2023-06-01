const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      min: 3,
      max: 255,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      min: 3,
      max: 255,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 255,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
      trim: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
    role: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
