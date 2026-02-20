const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const connectToDB = require("../config/connectToDB")
const User = require("../schemas/userModel")
const Doctor = require("../schemas/docModel")
const Appointment = require("../schemas/appointmentModel")
const doctorsData = require("../data/doctors_data.json")

const seedDatabase = async () => {
  try {
    await connectToDB()
    console.log("MongoDB Connected")

    // Clear existing data
    await User.deleteMany({})
    await Doctor.deleteMany({})
    await Appointment.deleteMany({})
    console.log("🗑️ Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("password123", 12)
    const adminUser = new User({
      name: "Admin User",
      email: "admin@docspot.com",
      password: adminPassword,
      phone: "+1-555-0001",
      isDoctor: false,
      type: "admin",
      notification: [],
    })
    await adminUser.save()
    console.log("👨‍💼 Created admin user")

    // Create regular users
    const users = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+1-555-0101",
        type: "user",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+1-555-0102",
        type: "user",
      },
      {
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+1-555-0103",
        type: "user",
      },
      {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        password: await bcrypt.hash("password123", 12),
        phone: "+1-555-0104",
        type: "user",
      },
    ]

    const createdUsers = await User.insertMany(users)
    console.log(`👤 Created ${createdUsers.length} regular users`)

    // Create doctor users and doctor profiles
    const doctorUsers = []
    const doctorProfiles = []

    for (const doctorData of doctorsData) {
      // Create user account for doctor
      const doctorUser = new User({
        name: doctorData.fullname,
        email: doctorData.email,
        password: await bcrypt.hash(doctorData.password, 12),
        phone: doctorData.phone,
        isDoctor: true,
        type: "doctor",
        notification: [],
      })
      const savedDoctorUser = await doctorUser.save()
      doctorUsers.push(savedDoctorUser)

      // Create doctor profile
      const doctorProfile = new Doctor({
        userId: savedDoctorUser._id,
        fullname: doctorData.fullname,
        email: doctorData.email,
        phone: doctorData.phone,
        address: doctorData.address,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        fees: doctorData.fees,
        timings: doctorData.timings,
        status: doctorData.status,
        licenseNumber: doctorData.licenseNumber || null,
        password: await bcrypt.hash(doctorData.password, 12),
      })
      doctorProfiles.push(doctorProfile)
    }

    await Doctor.insertMany(doctorProfiles)
    console.log(`👨‍⚕️ Created ${doctorUsers.length} doctors with profiles`)

    // Create sample appointments
    const sampleAppointments = [
      {
        doctorInfo: {
          _id: doctorProfiles[0]._id,
          fullname: doctorProfiles[0].fullname,
          email: doctorProfiles[0].email,
          phone: doctorProfiles[0].phone,
          address: doctorProfiles[0].address,
          specialization: doctorProfiles[0].specialization,
          fees: doctorProfiles[0].fees,
        },
        userInfo: {
          _id: createdUsers[0]._id,
          name: createdUsers[0].name,
          email: createdUsers[0].email,
          phone: createdUsers[0].phone,
        },
        date: "2025-07-25",
        time: "10:00 AM",
        status: "pending",
        notes: "Regular checkup",
      },
      {
        doctorInfo: {
          _id: doctorProfiles[1]._id,
          fullname: doctorProfiles[1].fullname,
          email: doctorProfiles[1].email,
          phone: doctorProfiles[1].phone,
          address: doctorProfiles[1].address,
          specialization: doctorProfiles[1].specialization,
          fees: doctorProfiles[1].fees,
        },
        userInfo: {
          _id: createdUsers[1]._id,
          name: createdUsers[1].name,
          email: createdUsers[1].email,
          phone: createdUsers[1].phone,
        },
        date: "2025-07-26",
        time: "2:00 PM",
        status: "approved",
        notes: "Follow-up consultation",
      },
    ]

    await Appointment.insertMany(sampleAppointments)
    console.log(`📅 Created ${sampleAppointments.length} sample appointments`)

    console.log("\n✅ Database seeded successfully!")
    console.log("\n🔐 Login Credentials:")
    console.log("Admin: admin@docspot.com / password123")
    console.log("Users: john.doe@example.com / password123")
    console.log("Doctors: Use emails from JSON with their specific passwords")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
