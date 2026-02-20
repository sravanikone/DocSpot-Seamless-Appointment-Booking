"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Button, Badge, Modal } from "react-bootstrap"
import { Eye, Check, X } from "lucide-react"
import axios from "axios"
import { useNotification } from "../../context/NotificationContext"
import AdminSidebar from "./AdminSidebar"

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const { addNotification } = useNotification()

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/doctors")
      setDoctors(response.data.doctors)
    } catch (error) {
      addNotification("Failed to fetch doctors", "error")
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const handleApproveDoctor = async (doctorId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-doctor/${doctorId}`, { status })
      addNotification(`Doctor ${status} successfully`, "success")
      fetchDoctors()
      setShowModal(false)
    } catch (error) {
      addNotification(`Failed to ${status} doctor`, "error")
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    }
    return <Badge bg={variants[status] || "secondary"}>{status.toUpperCase()}</Badge>
  }

  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <Container fluid className="main-content">
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold">Doctor Management</h2>
              <p className="text-muted">Approve and manage doctor applications</p>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5 className="mb-0">All Doctors</h5>
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Fees</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td>{doctor.fullname}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.experience} years</td>
                        <td>${doctor.fees}</td>
                        <td>{getStatusBadge(doctor.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" onClick={() => viewDoctorDetails(doctor)}>
                              <Eye size={14} />
                            </Button>
                            {doctor.status === "pending" && (
                              <>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => handleApproveDoctor(doctor._id, "approved")}
                                >
                                  <Check size={14} />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleApproveDoctor(doctor._id, "rejected")}
                                >
                                  <X size={14} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {!loading && doctors.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No doctors found</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Doctor Details Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Doctor Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedDoctor && (
                <Row>
                  <Col md={6}>
                    <h6>Personal Information</h6>
                    <p>
                      <strong>Name:</strong> {selectedDoctor.fullname}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedDoctor.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedDoctor.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedDoctor.address}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>Professional Information</h6>
                    <p>
                      <strong>Specialization:</strong> {selectedDoctor.specialization}
                    </p>
                    <p>
                      <strong>Experience:</strong> {selectedDoctor.experience} years
                    </p>
                    <p>
                      <strong>Consultation Fees:</strong> ${selectedDoctor.fees}
                    </p>
                    <p>
                      <strong>Available Timings:</strong> {selectedDoctor.timings}
                    </p>
                    <p>
                      <strong>Status:</strong> {getStatusBadge(selectedDoctor.status)}
                    </p>
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              {selectedDoctor && selectedDoctor.status === "pending" && (
                <>
                  <Button variant="success" onClick={() => handleApproveDoctor(selectedDoctor._id, "approved")}>
                    Approve Doctor
                  </Button>
                  <Button variant="danger" onClick={() => handleApproveDoctor(selectedDoctor._id, "rejected")}>
                    Reject Doctor
                  </Button>
                </>
              )}
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

export default AdminDoctors
