"use client"
import { Nav, Badge } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { Home, Users, UserCheck, Calendar, LogOut, Activity } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const AdminSidebar = () => {
  const location = useLocation()
  const { logout, user } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar bg-white shadow-sm" style={{ width: "280px", minHeight: "100vh" }}>
      <div className="p-4 border-bottom">
        <h4 className="text-primary fw-bold mb-1">DocSpot</h4>
        <div className="d-flex align-items-center">
          <Badge bg="danger" className="me-2">
            Admin
          </Badge>
          <small className="text-muted">{user?.name}</small>
        </div>
      </div>

      <Nav className="flex-column px-3 py-3">
        <Nav.Link
          as={Link}
          to="/admin"
          className={`nav-item rounded-3 mb-2 ${isActive("/admin") ? "active bg-primary text-white" : "text-dark"}`}
        >
          <Home size={18} className="me-3" />
          Dashboard
          {isActive("/admin") && <Activity size={16} className="ms-auto" />}
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/users"
          className={`nav-item rounded-3 mb-2 ${isActive("/admin/users") ? "active bg-primary text-white" : "text-dark"}`}
        >
          <Users size={18} className="me-3" />
          Users Management
          <Badge bg="secondary" className="ms-auto">
            156
          </Badge>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/doctors"
          className={`nav-item rounded-3 mb-2 ${isActive("/admin/doctors") ? "active bg-primary text-white" : "text-dark"}`}
        >
          <UserCheck size={18} className="me-3" />
          Doctors Management
          <Badge bg="warning" className="ms-auto">
            5
          </Badge>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/admin/appointments"
          className={`nav-item rounded-3 mb-2 ${isActive("/admin/appointments") ? "active bg-primary text-white" : "text-dark"}`}
        >
          <Calendar size={18} className="me-3" />
          Appointments
          <Badge bg="info" className="ms-auto">
            342
          </Badge>
        </Nav.Link>

        <hr className="my-3" />

        <Nav.Link
          onClick={logout}
          className="nav-item rounded-3 text-danger hover-bg-danger"
          style={{ cursor: "pointer" }}
        >
          <LogOut size={18} className="me-3" />
          Logout
        </Nav.Link>
      </Nav>
    </div>
  )
}

export default AdminSidebar
