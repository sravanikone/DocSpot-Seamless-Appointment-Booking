const mongoose = require("mongoose")
const connectToDB = require("../config/connectToDB")
const User = require("../schemas/userModel")
const Doctor = require("../schemas/docModel")
const Appointment = require("../schemas/appointmentModel")

const clearDatabase = async () => {
  try {
    await connectToDB()
    console.log("MongoDB Connected")

    // Drop all collections
    await User.deleteMany({})
    await Doctor.deleteMany({})
    await Appointment.deleteMany({})

    // Drop indexes to avoid conflicts
    try {
      await Doctor.collection.dropIndexes()
    } catch (error) {
      console.log("No indexes to drop for Doctor collection")
    }

    console.log("Database cleared successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error clearing database:", error)
    process.exit(1)
  }
}

clearDatabase()
