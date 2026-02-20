const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/docspot")
    console.log("MongoDB Connected")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

// Sample data for users collection
const sampleUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "+1-555-0101",
    isDoctor: false,
    type: "user",
    notification: [
      {
        type: "appointment-confirmed",
        message: "Your appointment has been confirmed",
        date: new Date(),
        read: false,
      },
    ],
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "password123",
    phone: "+1-555-0102",
    isDoctor: false,
    type: "user",
    notification: [],
  },
  {
    name: "Admin User",
    email: "admin@docspot.com",
    password: "admin123",
    phone: "+1-555-0001",
    isDoctor: false,
    type: "admin",
    notification: [],
  },
  {
    name: "Dr. Michael Johnson",
    email: "dr.johnson@example.com",
    password: "doctor123",
    phone: "+1-555-0201",
    isDoctor: true,
    type: "user",
    notification: [
      {
        type: "account-approved",
        message: "Your doctor account has been approved",
        date: new Date(),
        read: false,
      },
    ],
  },
  {
    name: "Dr. Sarah Wilson",
    email: "dr.wilson@example.com",
    password: "doctor123",
    phone: "+1-555-0202",
    isDoctor: true,
    type: "user",
    notification: [],
  },
  {
    name: "Dr. David Brown",
    email: "dr.brown@example.com",
    password: "doctor123",
    phone: "+1-555-0203",
    isDoctor: true,
    type: "user",
    notification: [],
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    password: "password123",
    phone: "+1-555-0103",
    isDoctor: false,
    type: "user",
    notification: [],
  },
  {
    name: "Robert Miller",
    email: "robert.miller@example.com",
    password: "password123",
    phone: "+1-555-0104",
    isDoctor: false,
    type: "user",
    notification: [],
  },
]

// Sample data for doctors collection
const sampleDoctors = [
  {
    fullname: "Dr. Michael Johnson",
    email: "dr.johnson@example.com",
    phone: "+1-555-0201",
    address: "123 Medical Center Dr, New York, NY 10001",
    specialization: "Cardiology",
    experience: "10",
    fees: "150",
    timings: "9:00 AM - 5:00 PM",
    status: "approved",
  },
  {
    fullname: "Dr. Sarah Wilson",
    email: "dr.wilson@example.com",
    phone: "+1-555-0202",
    address: "456 Health Plaza, Los Angeles, CA 90001",
    specialization: "Dermatology",
    experience: "8",
    fees: "120",
    timings: "10:00 AM - 6:00 PM",
    status: "approved",
  },
  {
    fullname: "Dr. David Brown",
    email: "dr.brown@example.com",
    phone: "+1-555-0203",
    address: "789 Wellness Ave, Chicago, IL 60601",
    specialization: "Pediatrics",
    experience: "12",
    fees: "100",
    timings: "8:00 AM - 4:00 PM",
    status: "approved",
  },
  {
    fullname: "Dr. Lisa Anderson",
    email: "dr.anderson@example.com",
    phone: "+1-555-0204",
    address: "321 Care Street, Houston, TX 77001",
    specialization: "Neurology",
    experience: "15",
    fees: "200",
    timings: "9:00 AM - 3:00 PM",
    status: "pending",
  },
  {
    fullname: "Dr. James Taylor",
    email: "dr.taylor@example.com",
    phone: "+1-555-0205",
    address: "654 Medical Way, Phoenix, AZ 85001",
    specialization: "Orthopedics",
    experience: "7",
    fees: "180",
    timings: "11:00 AM - 7:00 PM",
    status: "approved",
  },
  {
    fullname: "Dr. Maria Garcia",
    email: "dr.garcia@example.com",
    phone: "+1-555-0206",
    address: "987 Health Center Blvd, Philadelphia, PA 19101",
    specialization: "General Medicine",
    experience: "6",
    fees: "90",
    timings: "8:00 AM - 6:00 PM",
    status: "approved",
  },
]

// Sample data for appointments collection
const sampleAppointments = [
  {
    doctorInfo: {
      _id: null, // Will be set after doctor creation
      fullname: "Dr. Michael Johnson",
      email: "dr.johnson@example.com",
      phone: "+1-555-0201",
      address: "123 Medical Center Dr, New York, NY 10001",
      specialization: "Cardiology",
      fees: "150",
    },
    userInfo: {
      _id: null, // Will be set after user creation
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0101",
    },
    date: "2024-02-15",
    time: "10:00 AM",
    status: "approved",
    document: "medical-report-001.pdf",
  },
  {
    doctorInfo: {
      _id: null,
      fullname: "Dr. Sarah Wilson",
      email: "dr.wilson@example.com",
      phone: "+1-555-0202",
      address: "456 Health Plaza, Los Angeles, CA 90001",
      specialization: "Dermatology",
      fees: "120",
    },
    userInfo: {
      _id: null,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-0102",
    },
    date: "2024-02-16",
    time: "2:00 PM",
    status: "pending",
    document: "",
  },
  {
    doctorInfo: {
      _id: null,
      fullname: "Dr. David Brown",
      email: "dr.brown@example.com",
      phone: "+1-555-0203",
      address: "789 Wellness Ave, Chicago, IL 60601",
      specialization: "Pediatrics",
      fees: "100",
    },
    userInfo: {
      _id: null,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1-555-0103",
    },
    date: "2024-02-17",
    time: "11:00 AM",
    status: "completed",
    document: "child-vaccination-record.pdf",
  },
  {
    doctorInfo: {
      _id: null,
      fullname: "Dr. James Taylor",
      email: "dr.taylor@example.com",
      phone: "+1-555-0205",
      address: "654 Medical Way, Phoenix, AZ 85001",
      specialization: "Orthopedics",
      fees: "180",
    },
    userInfo: {
      _id: null,
      name: "Robert Miller",
      email: "robert.miller@example.com",
      phone: "+1-555-0104",
    },
    date: "2024-02-18",
    time: "3:00 PM",
    status: "cancelled",
    document: "x-ray-report.pdf",
  },
  {
    doctorInfo: {
      _id: null,
      fullname: "Dr. Maria Garcia",
      email: "dr.garcia@example.com",
      phone: "+1-555-0206",
      address: "987 Health Center Blvd, Philadelphia, PA 19101",
      specialization: "General Medicine",
      fees: "90",
    },
    userInfo: {
      _id: null,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0101",
    },
    date: "2024-02-20",
    time: "9:00 AM",
    status: "pending",
    document: "blood-test-results.pdf",
  },
]

const seedDatabase = async () => {
  try {
    await connectDB()

    // Clear existing data
    await mongoose.connection.db.collection("users").deleteMany({})
    await mongoose.connection.db.collection("doctors").deleteMany({})
    await mongoose.connection.db.collection("appointments").deleteMany({})

    console.log("Cleared existing data")

    // Hash passwords for users
    for (const user of sampleUsers) {
      user.password = await bcrypt.hash(user.password, 12)
    }

    // Insert users
    const insertedUsers = await mongoose.connection.db.collection("users").insertMany(sampleUsers)
    console.log(`Inserted ${insertedUsers.insertedCount} users`)

    // Get user IDs for doctors
    const doctorUsers = await mongoose.connection.db.collection("users").find({ isDoctor: true }).toArray()

    // Add userID to doctors and insert
    for (let i = 0; i < sampleDoctors.length; i++) {
      if (doctorUsers[i]) {
        sampleDoctors[i].userId = doctorUsers[i]._id
      }
    }

    const insertedDoctors = await mongoose.connection.db.collection("doctors").insertMany(sampleDoctors)
    console.log(`Inserted ${insertedDoctors.insertedCount} doctors`)

    // Get all users and doctors for appointments
    const allUsers = await mongoose.connection.db.collection("users").find({ type: "user", isDoctor: false }).toArray()
    const allDoctors = await mongoose.connection.db.collection("doctors").find({}).toArray()

    // Update appointment data with actual IDs
    for (let i = 0; i < sampleAppointments.length; i++) {
      // Find matching doctor
      const doctor = allDoctors.find((d) => d.email === sampleAppointments[i].doctorInfo.email)
      if (doctor) {
        sampleAppointments[i].doctorInfo._id = doctor._id
      }

      // Find matching user
      const user = allUsers.find((u) => u.email === sampleAppointments[i].userInfo.email)
      if (user) {
        sampleAppointments[i].userInfo._id = user._id
      }
    }

    const insertedAppointments = await mongoose.connection.db.collection("appointments").insertMany(sampleAppointments)
    console.log(`Inserted ${insertedAppointments.insertedCount} appointments`)

    console.log("Database seeded successfully!")
    console.log("\nSample Login Credentials:")
    console.log("Admin: admin@docspot.com / admin123")
    console.log("User: john.doe@example.com / password123")
    console.log("Doctor: dr.johnson@example.com / doctor123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
