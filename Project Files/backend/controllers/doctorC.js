const Doctor = require("../schemas/docModel")
const Appointment = require("../schemas/appointmentModel")
const User = require("../schemas/userModel")
const bcrypt = require("bcryptjs")

// Apply to become a doctor
const applyDoctor = async (req, res) => {
  try {
    const { fullname, email, phone, address, specialization, experience, fees, timings } = req.body
    const userId = req.user._id

    // Check if user already applied
    const existingApplication = await Doctor.findOne({ userId })
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to become a doctor" })
    }

    // Check if email is already used by another doctor
    const existingDoctor = await Doctor.findOne({ email })
    if (existingDoctor) {
      return res.status(400).json({ message: "Email already registered as doctor" })
    }

    // Create doctor application
    const doctor = new Doctor({
      userId,
      fullname,
      email,
      phone,
      address,
      specialization,
      experience,
      fees,
      timings,
      status: "pending",
      password: await bcrypt.hash("TempPassword123!", 12), // Temporary password
    })

    await doctor.save()

    // Add notification to user
    await User.findByIdAndUpdate(userId, {
      $push: {
        notification: {
          type: "doctor-application",
          message: "Your doctor application has been submitted and is under review.",
          data: {
            doctorId: doctor._id,
            status: "pending",
          },
          createdAt: new Date(),
          read: false,
        },
      },
    })

    res.status(201).json({ message: "Doctor application submitted successfully", doctor })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get doctor dashboard stats
const getDoctorStats = async (req, res) => {
  try {
    const userId = req.user._id

    // Find doctor profile
    const doctor = await Doctor.findOne({ userId })
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      })
    }

    // Get appointment stats
    const totalAppointments = await Appointment.countDocuments({
      "doctorInfo._id": doctor._id,
    })

    const pendingAppointments = await Appointment.countDocuments({
      "doctorInfo._id": doctor._id,
      status: "pending",
    })

    const approvedAppointments = await Appointment.countDocuments({
      "doctorInfo._id": doctor._id,
      status: "approved",
    })

    const completedAppointments = await Appointment.countDocuments({
      "doctorInfo._id": doctor._id,
      status: "completed",
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAppointments = await Appointment.countDocuments({
      "doctorInfo._id": doctor._id,
      date: {
        $gte: today.toISOString().split("T")[0],
        $lt: tomorrow.toISOString().split("T")[0],
      },
    })

    res.json({
      success: true,
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
      todayAppointments,
      doctorInfo: doctor,
    })
  } catch (error) {
    console.error("Doctor stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor statistics",
      error: error.message,
    })
  }
}

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user._id

    // Find doctor profile
    const doctor = await Doctor.findOne({ userId })
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      })
    }

    const appointments = await Appointment.find({
      "doctorInfo._id": doctor._id,
    }).sort({ createdAt: -1 })

    res.json({
      success: true,
      appointments,
    })
  } catch (error) {
    console.error("Get doctor appointments error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    })
  }
}

// Update appointment status - FIXED VERSION
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params
    const { status, notes } = req.body
    const userId = req.user._id

    console.log("Updating appointment:", { appointmentId, status, notes, userId })

    // Verify doctor profile exists
    const doctor = await Doctor.findOne({ userId })
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      })
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    // Verify doctor owns this appointment
    if (appointment.doctorInfo._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This appointment doesn't belong to you.",
      })
    }

    // Update appointment status
    appointment.status = status
    if (notes) {
      appointment.doctorNotes = notes
    }
    appointment.updatedAt = new Date()

    await appointment.save()

    // Create notification message based on status
    let notificationMessage = ""
    switch (status) {
      case "approved":
        notificationMessage = `Great news! Dr. ${doctor.fullname} has approved your appointment for ${appointment.date} at ${appointment.time}. ${notes ? `Doctor's note: ${notes}` : ""}`
        break
      case "rejected":
        notificationMessage = `Unfortunately, Dr. ${doctor.fullname} had to decline your appointment for ${appointment.date} at ${appointment.time}. ${notes ? `Reason: ${notes}` : ""}`
        break
      case "completed":
        notificationMessage = `Your appointment with Dr. ${doctor.fullname} has been completed. ${notes ? `Summary: ${notes}` : ""}`
        break
      case "cancelled":
        notificationMessage = `Your appointment with Dr. ${doctor.fullname} has been cancelled. ${notes ? `Reason: ${notes}` : ""}`
        break
      default:
        notificationMessage = `Your appointment status has been updated to ${status}`
    }

    // Add notification to patient
    await User.findByIdAndUpdate(appointment.userInfo._id, {
      $push: {
        notification: {
          type: "appointment-status",
          message: notificationMessage,
          data: {
            appointmentId: appointment._id,
            status: status,
            doctorName: doctor.fullname,
            date: appointment.date,
            time: appointment.time,
            notes: notes || "",
          },
          createdAt: new Date(),
          read: false,
        },
      },
    })

    console.log("Appointment updated successfully:", appointment)

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    })
  } catch (error) {
    console.error("Update appointment status error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    })
  }
}

// Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const doctor = await Doctor.findOne({ userId }).populate("userId", "name email phone")

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" })
    }

    res.json({ doctor })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const { fullname, phone, address, specialization, experience, fees, timings } = req.body

    const doctor = await Doctor.findOne({ userId })
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" })
    }

    // Update doctor profile
    doctor.fullname = fullname || doctor.fullname
    doctor.phone = phone || doctor.phone
    doctor.address = address || doctor.address
    doctor.specialization = specialization || doctor.specialization
    doctor.experience = experience || doctor.experience
    doctor.fees = fees || doctor.fees
    doctor.timings = timings || doctor.timings

    await doctor.save()

    // Also update user name if provided
    if (fullname) {
      await User.findByIdAndUpdate(userId, { name: fullname })
    }

    res.json({ message: "Profile updated successfully", doctor })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  applyDoctor,
  getDoctorStats,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorProfile,
  updateDoctorProfile,
}
