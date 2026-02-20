const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const {
  applyDoctor,
  getDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorStats,
  updateDoctorProfile,
} = require("../controllers/doctorC")

// All doctor routes require authentication
router.use(authMiddleware)

// Doctor application and profile
router.post("/apply", applyDoctor)
router.get("/profile", getDoctorProfile)
router.put("/profile", updateDoctorProfile)

// Doctor dashboard
router.get("/stats", getDoctorStats)

// Appointment management - FIXED ROUTES
router.get("/appointments", getDoctorAppointments)
router.put("/appointments/:appointmentId/status", updateAppointmentStatus)

module.exports = router
