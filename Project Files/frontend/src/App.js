import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"

// Common Components
import Home from "./components/common/Home"
import Login from "./components/common/Login"
import Register from "./components/common/Register"
import Notification from "./components/common/Notification"

// User Components
import UserHome from "./components/user/UserHome"
import UserAppointments from "./components/user/UserAppointments"
import BookAppointment from "./components/user/BookAppointment"
import DoctorList from "./components/user/DoctorList"
import AddDocument from "./components/user/AddDocument"

// Doctor Components
import ApplyDoctor from "./components/user/ApplyDoctor"
import DoctorHome from "./components/doctor/DoctorHome"
import DoctorAppointments from "./components/doctor/DoctorAppointments"

// Admin Components
import AdminHome from "./components/admin/AdminHome"
import AdminUsers from "./components/admin/AdminUsers"
import AdminDoctors from "./components/admin/AdminDoctors"
import AdminAppointments from "./components/admin/AdminAppointments"

// Protected Route Component
import ProtectedRoute from "./components/common/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Notification />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/apply-doctor" element={<ApplyDoctor />} />

              {/* User Routes */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/appointments"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/book-appointment"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/doctors"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <DoctorList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/add-document"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <AddDocument />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Routes */}
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorAppointments />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDoctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminAppointments />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
