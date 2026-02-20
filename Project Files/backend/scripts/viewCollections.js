const mongoose = require("mongoose")
require("dotenv").config()

const viewCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/docspot")
    console.log("MongoDB Connected")

    // Get collection stats
    const usersCount = await mongoose.connection.db.collection("users").countDocuments()
    const doctorsCount = await mongoose.connection.db.collection("doctors").countDocuments()
    const appointmentsCount = await mongoose.connection.db.collection("appointments").countDocuments()

    console.log("\n=== DocSpot Database Collections ===")
    console.log(`docspot.users: ${usersCount} documents`)
    console.log(`docspot.doctors: ${doctorsCount} documents`)
    console.log(`docspot.appointments: ${appointmentsCount} documents`)

    // Show sample documents
    console.log("\n=== Sample Documents ===")

    const sampleUser = await mongoose.connection.db.collection("users").findOne()
    console.log("\nSample User:", JSON.stringify(sampleUser, null, 2))

    const sampleDoctor = await mongoose.connection.db.collection("doctors").findOne()
    console.log("\nSample Doctor:", JSON.stringify(sampleDoctor, null, 2))

    const sampleAppointment = await mongoose.connection.db.collection("appointments").findOne()
    console.log("\nSample Appointment:", JSON.stringify(sampleAppointment, null, 2))

    process.exit(0)
  } catch (error) {
    console.error("Error viewing collections:", error)
    process.exit(1)
  }
}

viewCollections()
