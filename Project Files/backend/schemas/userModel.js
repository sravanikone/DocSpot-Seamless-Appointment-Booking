const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    notification: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
