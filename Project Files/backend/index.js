const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/connectToDB")

// Load environment variables
dotenv.config()

// Import routes
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")
const doctorRoutes = require("./routes/doctorRoutes")

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/doctor", doctorRoutes)

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "DocSpot API is running!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
