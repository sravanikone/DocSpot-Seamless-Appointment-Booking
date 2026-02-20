const User = require("../schemas/userModel")
const Doctor = require("../schemas/docModel")
const Appointment = require("../schemas/appointmentModel")
const bcrypt = require("bcryptjs")

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ type: "user" })
    const totalDoctors = await Doctor.countDocuments()
    const approvedDoctors = await Doctor.countDocuments({ status: "approved" })
    const pendingDoctors = await Doctor.countDocuments({ status: "pending" })
    const totalAppointments = await Appointment.countDocuments()
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" })
    const approvedAppointments = await Appointment.countDocuments({ status: "approved" })
    const completedAppointments = await Appointment.countDocuments({ status: "completed" })

    res.json({
      totalUsers,
      totalDoctors,
      approvedDoctors,
      pendingDoctors,
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ type: "user" }).select("-password").sort({ createdAt: -1 })
    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email phone").sort({ createdAt: -1 })
    res.json({ doctors })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Approve doctor
const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params
    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    // Update doctor status
    doctor.status = "approved"
    await doctor.save()

    // Update user to be a doctor
    await User.findByIdAndUpdate(doctor.userId, {
      isDoctor: true,
      type: "doctor",
    })

    // Add notification to doctor
    await User.findByIdAndUpdate(doctor.userId, {
      $push: {
        notification: {
          type: "doctor-approved",
          message: "Your doctor application has been approved!",
          data: {
            doctorId: doctor._id,
            status: "approved",
          },
          createdAt: new Date(),
          read: false,
        },
      },
    })

    res.json({ message: "Doctor approved successfully", doctor })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Reject doctor
const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params
    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    // Update doctor status
    doctor.status = "rejected"
    await doctor.save()

    // Add notification to doctor
    await User.findByIdAndUpdate(doctor.userId, {
      $push: {
        notification: {
          type: "doctor-rejected",
          message: "Your doctor application has been rejected. Please contact support for more information.",
          data: {
            doctorId: doctor._id,
            status: "rejected",
          },
          createdAt: new Date(),
          read: false,
        },
      },
    })

    res.json({ message: "Doctor rejected successfully", doctor })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 })
    res.json({ appointments })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // If user is a doctor, also delete doctor record
    if (user.isDoctor) {
      await Doctor.findOneAndDelete({ userId: userId })
    }

    // Delete user's appointments
    await Appointment.deleteMany({
      $or: [{ "userInfo._id": userId }, { "doctorInfo.userId": userId }],
    })

    // Delete user
    await User.findByIdAndDelete(userId)

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { name, email, phone } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    // Update user
    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    await user.save()

    // If user is a doctor, update doctor record too
    if (user.isDoctor) {
      await Doctor.findOneAndUpdate(
        { userId: userId },
        {
          fullname: name || user.name,
          email: email || user.email,
          phone: phone || user.phone,
        },
      )
    }

    res.json({ message: "User updated successfully", user: { ...user.toObject(), password: undefined } })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
  deleteUser,
  updateUser,
}
