"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./AdminHome.css"

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    approvedDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    completedAppointments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-home">
        <div className="admin-header">
          <h1>Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-home">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to DocSpot Administration Panel</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card doctors">
          <div className="stat-number">{stats.approvedDoctors}</div>
          <div className="stat-label">Approved Doctors</div>
        </div>
        <div className="stat-card appointments">
          <div className="stat-number">{stats.totalAppointments}</div>
          <div className="stat-label">Total Appointments</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pendingDoctors}</div>
          <div className="stat-label">Pending Applications</div>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/admin/users" className="action-btn">
          👥 Manage Users
        </Link>
        <Link to="/admin/doctors" className="action-btn">
          👨‍⚕️ Manage Doctors
        </Link>
        <Link to="/admin/appointments" className="action-btn">
          📅 View Appointments
        </Link>
        <Link to="/admin/analytics" className="action-btn">
          📊 Analytics
        </Link>
      </div>

      <div className="recent-activity">
        <h3>System Overview</h3>
        <ul className="activity-list">
          <li className="activity-item">
            <span className="activity-text">{stats.pendingAppointments} appointments pending approval</span>
            <span className="activity-time">Now</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">{stats.approvedAppointments} appointments approved today</span>
            <span className="activity-time">Today</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">{stats.completedAppointments} appointments completed</span>
            <span className="activity-time">This week</span>
          </li>
          <li className="activity-item">
            <span className="activity-text">{stats.pendingDoctors} doctor applications awaiting review</span>
            <span className="activity-time">Pending</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminHome
