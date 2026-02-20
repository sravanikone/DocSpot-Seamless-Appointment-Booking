const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
  {
    doctorInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"],
      default: "pending",
    },
    document: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Appointment", appointmentSchema)
