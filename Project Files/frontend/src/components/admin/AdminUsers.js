"use client"

import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert } from "react-bootstrap"
import { Eye, Edit, Trash2, UserPlus } from "lucide-react"
import axios from "axios"
import { useNotification } from "../../context/NotificationContext"
import AdminSidebar from "./AdminSidebar"
import moment from "moment"

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalType, setModalType] = useState("view") // view, edit, delete
  const { addNotification } = useNotification()

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/users")
      setUsers(response.data.users)
    } catch (error) {
      addNotification("Failed to fetch users", "error")
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalType("view")
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setModalType("edit")
    setShowModal(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setModalType("delete")
    setShowModal(true)
  }

  const confirmDelete = async () => {
    try {
      // Note: You'll need to implement this endpoint in your backend
      await axios.delete(`http://localhost:5000/api/admin/users/${selectedUser._id}`)
      addNotification("User deleted successfully", "success")
      fetchUsers()
      setShowModal(false)
    } catch (error) {
      addNotification("Failed to delete user", "error")
    }
  }

  const getUserTypeBadge = (user) => {
    if (user.type === "admin") {
      return <Badge bg="danger">Admin</Badge>
    } else if (user.isDoctor) {
      return <Badge bg="success">Doctor</Badge>
    } else {
      return <Badge bg="primary">Patient</Badge>
    }
  }

  const getStatusBadge = (user) => {
    // You can add user status logic here
    return <Badge bg="success">Active</Badge>
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <Container fluid className="main-content">
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="fw-bold">User Management</h2>
                  <p className="text-muted">Manage all registered users</p>
                </div>
                <Button variant="primary">
                  <UserPlus size={16} className="me-2" />
                  Add New User
                </Button>
              </div>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5 className="mb-0">All Users ({users.length})</h5>
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
                      <th>Phone</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{getUserTypeBadge(user)}</td>
                        <td>{getStatusBadge(user)}</td>
                        <td>{moment(user.createdAt).format("MMM DD, YYYY")}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleViewUser(user)}>
                              <Eye size={14} />
                            </Button>
                            <Button variant="outline-warning" size="sm" onClick={() => handleEditUser(user)}>
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {!loading && users.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No users found</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* User Details Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                {modalType === "view" && "User Details"}
                {modalType === "edit" && "Edit User"}
                {modalType === "delete" && "Delete User"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedUser && modalType === "view" && (
                <Row>
                  <Col md={6}>
                    <h6>Personal Information</h6>
                    <p>
                      <strong>Name:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedUser.phone}
                    </p>
                    <p>
                      <strong>User Type:</strong> {getUserTypeBadge(selectedUser)}
                    </p>
                  </Col>
                  <Col md={6}>
                    <h6>Account Information</h6>
                    <p>
                      <strong>Joined:</strong> {moment(selectedUser.createdAt).format("MMMM DD, YYYY")}
                    </p>
                    <p>
                      <strong>Last Updated:</strong> {moment(selectedUser.updatedAt).format("MMMM DD, YYYY")}
                    </p>
                    <p>
                      <strong>Notifications:</strong> {selectedUser.notification?.length || 0} unread
                    </p>
                  </Col>
                </Row>
              )}

              {selectedUser && modalType === "edit" && (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" defaultValue={selectedUser.name} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" defaultValue={selectedUser.email} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="tel" defaultValue={selectedUser.phone} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>User Type</Form.Label>
                        <Form.Select defaultValue={selectedUser.type}>
                          <option value="user">Patient</option>
                          <option value="admin">Admin</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )}

              {selectedUser && modalType === "delete" && (
                <div>
                  <p>Are you sure you want to delete this user?</p>
                  <div className="bg-light p-3 rounded">
                    <strong>Name:</strong> {selectedUser.name}
                    <br />
                    <strong>Email:</strong> {selectedUser.email}
                    <br />
                    <strong>Type:</strong> {getUserTypeBadge(selectedUser)}
                  </div>
                  <Alert variant="danger" className="mt-3">
                    <strong>Warning:</strong> This action cannot be undone. All user data will be permanently deleted.
                  </Alert>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              {modalType === "view" && (
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              )}
              {modalType === "edit" && (
                <>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary">Save Changes</Button>
                </>
              )}
              {modalType === "delete" && (
                <>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={confirmDelete}>
                    Delete User
                  </Button>
                </>
              )}
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  )
}

export default AdminUsers
