const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const {
  registerUser,
  loginUser,
  getAllDoctors,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
} = require("../controllers/userC")

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.get("/doctors", authMiddleware, getAllDoctors)
router.post("/book-appointment", authMiddleware, bookAppointment)
router.get("/appointments", authMiddleware, getUserAppointments)
router.put("/cancel-appointment/:appointmentId", authMiddleware, cancelAppointment)

module.exports = router
