const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    fees: {
      type: String,
      required: true,
    },
    timings: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    licenseNumber: {
      type: String,
      sparse: true, // This allows multiple null values
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create sparse index for licenseNumber to allow multiple null values
doctorSchema.index({ licenseNumber: 1 }, { sparse: true })

module.exports = mongoose.model("Doctor", doctorSchema)
