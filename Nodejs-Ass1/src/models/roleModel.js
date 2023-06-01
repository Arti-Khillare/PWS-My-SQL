const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roles: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roles", roleSchema);
