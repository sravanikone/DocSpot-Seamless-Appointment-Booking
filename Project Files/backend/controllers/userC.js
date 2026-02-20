const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../schemas/userModel")
const Doctor = require("../schemas/docModel")
const Appointment = require("../schemas/appointmentModel")

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      isDoctor: false,
      type: "user",
    })

    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user in database
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    // Get additional info for doctors
    let doctorInfo = null
    if (user.isDoctor) {
      doctorInfo = await Doctor.findOne({ userId: user._id })
    }

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isDoctor: user.isDoctor,
        type: user.type,
        notification: user.notification,
        doctorInfo: doctorInfo,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get all approved doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" }).populate("userId", "name email phone")
    res.json({ doctors })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, document, notes } = req.body
    const userId = req.user._id

    // Get doctor info
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    // Get user info
    const user = await User.findById(userId)

    // Check for existing appointment at same time
    const existingAppointment = await Appointment.findOne({
      "doctorInfo._id": doctorId,
      date: date,
      time: time,
      status: { $in: ["pending", "approved"] },
    })

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked" })
    }

    // Create appointment
    const appointment = new Appointment({
      doctorInfo: {
        _id: doctor._id,
        fullname: doctor.fullname,
        email: doctor.email,
        phone: doctor.phone,
        address: doctor.address,
        specialization: doctor.specialization,
        fees: doctor.fees,
      },
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      date,
      time,
      document: document || "",
      notes: notes || "",
      status: "pending",
    })

    await appointment.save()

    // Add notification to doctor's user account
    await User.findByIdAndUpdate(doctor.userId, {
      $push: {
        notification: {
          type: "new-appointment",
          message: `New appointment request from ${user.name} for ${date} at ${time}`,
          data: {
            appointmentId: appointment._id,
            patientName: user.name,
            date: date,
            time: time,
          },
          createdAt: new Date(),
          read: false,
        },
      },
    })

    res.status(201).json({ message: "Appointment booked successfully", appointment })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id
    const appointments = await Appointment.find({ "userInfo._id": userId }).sort({ createdAt: -1 })
    res.json({ appointments })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params
    const userId = req.user._id

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      "userInfo._id": userId,
    })

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel completed appointment" })
    }

    appointment.status = "cancelled"
    await appointment.save()

    // Notify doctor
    const doctor = await Doctor.findById(appointment.doctorInfo._id)
    if (doctor) {
      await User.findByIdAndUpdate(doctor.userId, {
        $push: {
          notification: {
            type: "appointment-cancelled",
            message: `Appointment cancelled by ${appointment.userInfo.name}`,
            data: {
              appointmentId: appointment._id,
              patientName: appointment.userInfo.name,
              date: appointment.date,
              time: appointment.time,
            },
            createdAt: new Date(),
            read: false,
          },
        },
      })
    }

    res.json({ message: "Appointment cancelled successfully", appointment })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAllDoctors,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
}
