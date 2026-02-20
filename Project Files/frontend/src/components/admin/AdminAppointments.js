"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from "react-bootstrap"
import { Eye, Calendar, Filter } from "lucide-react"
import axios from "axios"
import { useNotification } from "../../context/NotificationContext"
import AdminSidebar from "./AdminSidebar"
import moment from "moment"

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const { addNotification } = useNotification()

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ]

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/appointments")
      setAppointments(response.data.appointments)
    } catch (error) {
      addNotification("Failed to fetch appointments", "error")
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  const filterAppointments = useCallback(() => {
    let filtered = appointments

    if (statusFilter !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, statusFilter])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  useEffect(() => {
    filterAppointments()
  }, [filterAppointments])

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      cancelled: "danger",
      completed: "info",
    }
    return <Badge bg={variants[status] || "secondary"}>{status.toUpperCase()}</Badge>
  }

  const getStatusStats = () => {
    const stats = {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <Container fluid className="main-content">
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold">Appointment Management</h2>
              <p className="text-muted">Monitor and manage all appointments</p>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={6} lg={2} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-primary">{stats.total}</h3>
                  <p className="mb-0 text-muted">Total</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={2} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-warning">{stats.pending}</h3>
                  <p className="mb-0 text-muted">Pending</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={2} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-success">{stats.approved}</h3>
                  <p className="mb-0 text-muted">Approved</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={2} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-info">{stats.completed}</h3>
                  <p className="mb-0 text-muted">Completed</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={2} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-danger">{stats.cancelled}</h3>
                  <p className="mb-0 text-muted">Cancelled</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">All Appointments ({filteredAppointments.length})</h5>
                </Col>
                <Col xs="auto">
                  <div className="d-flex align-items-center gap-2">
                    <Filter size={16} />
                    <Form.Select
                      size="sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ width: "150px" }}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Booked On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>
                          <div>
                            <div className="fw-medium">{appointment.userInfo.name}</div>
                            <small className="text-muted">{appointment.userInfo.email}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">{appointment.doctorInfo.fullname}</div>
                            <small className="text-muted">{appointment.doctorInfo.specialization}</small>
                          </div>
                        </td>
                        <td>{moment(appointment.date).format("MMM DD, YYYY")}</td>
                        <td>{appointment.time}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>{moment(appointment.createdAt).format("MMM DD, YYYY")}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewAppointment(appointment)}
                            >
                              <Eye size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {!loading && filteredAppointments.length === 0 && (
                <div className="text-center py-4">
                  <Calendar size={48} className="text-muted mb-3" />
                  <p className="text-muted">No appointments found</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Appointment Details Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedAppointment && (
                <Row>
                  <Col md={6}>
                    <h6>Patient Information</h6>
                    <p>
                      <strong>Name:</strong> {selectedAppointment.userInfo.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedAppointment.userInfo.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedAppointment.userInfo.phone}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>Doctor Information</h6>
                    <p>
                      <strong>Name:</strong> {selectedAppointment.doctorInfo.fullname}
                    </p>
                    <p>
                      <strong>Specialization:</strong> {selectedAppointment.doctorInfo.specialization}
                    </p>
                    <p>
                      <strong>Fees:</strong> ${selectedAppointment.doctorInfo.fees}
                    </p>
                  </Col>
                  <Col md={12}>
                    <hr />
                    <h6>Appointment Details</h6>
                    <Row>
                      <Col md={6}>
                        <p>
                          <strong>Date:</strong> {moment(selectedAppointment.date).format("MMMM DD, YYYY")}
                        </p>
                        <p>
                          <strong>Time:</strong> {selectedAppointment.time}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p>
                          <strong>Status:</strong> {getStatusBadge(selectedAppointment.status)}
                        </p>
                        <p>
                          <strong>Booked On:</strong> {moment(selectedAppointment.createdAt).format("MMMM DD, YYYY")}
                        </p>
                      </Col>
                    </Row>
                    {selectedAppointment.document && (
                      <p>
                        <strong>Document:</strong> {selectedAppointment.document}
                      </p>
                    )}
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  )
}

export default AdminAppointments
