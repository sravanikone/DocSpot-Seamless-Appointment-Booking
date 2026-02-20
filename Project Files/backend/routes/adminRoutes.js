const express = require("express")
const router = express.Router()
const authMiddleware = require("../middlewares/authMiddleware")
const {
  getAdminStats,
  getAllUsers,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
  deleteUser,
  updateUser,
} = require("../controllers/adminC")

// All admin routes require authentication
router.use(authMiddleware)

// Admin dashboard stats
router.get("/stats", getAdminStats)

// User management
router.get("/users", getAllUsers)
router.put("/users/:userId", updateUser)
router.delete("/users/:userId", deleteUser)

// Doctor management
router.get("/doctors", getAllDoctors)
router.put("/doctors/approve/:doctorId", approveDoctor)
router.put("/doctors/reject/:doctorId", rejectDoctor)

// Appointment management
router.get("/appointments", getAllAppointments)

module.exports = router
