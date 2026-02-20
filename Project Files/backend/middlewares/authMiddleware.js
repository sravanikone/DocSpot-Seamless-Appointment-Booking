const jwt = require("jsonwebtoken")
const User = require("../schemas/userModel")

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Handle admin token
    if (token === "admin-token") {
      req.user = {
        _id: "admin",
        name: "Admin User",
        email: "admin@docspot.com",
        type: "admin",
        isDoctor: false,
      }
      return next()
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Handle admin user ID
    if (decoded.userId === "admin") {
      req.user = {
        _id: "admin",
        name: "Admin User",
        email: "admin@docspot.com",
        type: "admin",
        isDoctor: false,
      }
      return next()
    }

    // Find user in database
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

module.exports = authMiddleware
