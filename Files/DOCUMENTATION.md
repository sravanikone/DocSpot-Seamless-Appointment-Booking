# DocSpot - Technical Documentation

## 🏗️ System Architecture

### Overview
DocSpot follows a traditional MERN stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express Server │────│  MongoDB Atlas  │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: React 18, React Router, Bootstrap, Material-UI
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer middleware
- **Security**: bcryptjs, CORS, JWT tokens

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  fullname: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  isAdmin: Boolean,
  isDoctor: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  fullname: String,
  email: String,
  phone: String,
  address: String,
  specialization: String,
  experience: String,
  fees: String,
  timings: String,
  status: String (pending/approved/rejected),
  licenseNumber: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  date: Date,
  time: String,
  status: String (pending/approved/rejected/completed),
  notes: String,
  doctorNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

### User Registration
1. User submits registration form
2. Password is hashed using bcryptjs
3. User document is created in MongoDB
4. JWT token is generated and returned

### User Login
1. User submits email and password
2. System validates credentials
3. Password is compared with hashed version
4. JWT token is generated with user role
5. Token is stored in localStorage

### Protected Routes
1. Frontend checks for valid JWT token
2. Token is sent in Authorization header
3. Backend middleware validates token
4. User information is attached to request
5. Route handler processes authenticated request

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "isDoctor": false
  }
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Endpoints

#### GET /api/users/profile
Get current user profile (requires authentication).

#### PUT /api/users/profile
Update user profile information.

#### POST /api/users/apply-doctor
Submit doctor application.

### Doctor Endpoints

#### GET /api/doctors
Get all approved doctors.

#### GET /api/doctors/appointments
Get appointments for logged-in doctor.

#### PUT /api/doctors/appointments/:id/status
Update appointment status (approve/reject/complete).

### Admin Endpoints

#### GET /api/admin/users
Get all users (admin only).

#### GET /api/admin/doctors
Get all doctors with their status.

#### PUT /api/admin/doctors/:id/approve
Approve or reject doctor application.

## 🧩 Component Structure

### Frontend Architecture
```
src/
├── components/
│   ├── common/          # Shared components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Home.jsx
│   ├── user/            # Patient components
│   │   ├── UserHome.jsx
│   │   ├── DoctorList.jsx
│   │   └── BookAppointment.jsx
│   ├── doctor/          # Doctor components
│   │   ├── DoctorHome.jsx
│   │   └── DoctorAppointments.jsx
│   └── admin/           # Admin components
│       ├── AdminHome.jsx
│       ├── AdminUsers.jsx
│       └── AdminDoctors.jsx
├── context/             # React Context
│   ├── AuthContext.js
│   └── NotificationContext.js
└── App.js              # Main application component
```

### State Management
- **AuthContext**: Manages user authentication state
- **NotificationContext**: Handles application notifications
- **Local State**: Component-specific state using useState

## 🚀 Deployment Guide

### Prerequisites
- Node.js 16+ installed
- MongoDB database (local or Atlas)
- Git repository

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/docspot
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Deployment Steps

#### Backend (Railway/Heroku)
1. Create new project on platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend service

#### Frontend (Netlify/Vercel)
1. Build React application: `npm run build`
2. Upload build folder to hosting platform
3. Configure environment variables
4. Set up custom domain (optional)

### Database Setup
1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Update connection string in environment variables

## 🔧 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure backend CORS is configured for frontend URL
- Check environment variables are set correctly

#### Authentication Issues
- Verify JWT secret is consistent
- Check token expiration settings
- Ensure proper header format: `Bearer <token>`

#### Database Connection
- Verify MongoDB URI format
- Check network connectivity
- Ensure database user has proper permissions

### Performance Optimization
- Implement pagination for large datasets
- Add database indexing for frequently queried fields
- Use React.memo for expensive components
- Implement lazy loading for routes

## 📊 Monitoring & Analytics

### Logging
- Server logs for API requests
- Error tracking for debugging
- User activity monitoring

### Metrics to Track
- User registration rates
- Appointment booking success rates
- Doctor approval times
- System response times

---

**For additional support, please refer to the main README.md or create an issue in the repository.**