# 🏥 Healthcare Appointment System

A modern, full-stack **Healthcare Appointment & Patient Management Platform** built with **React, FastAPI, Python, and PostgreSQL**.

The platform enables patients to discover doctors and book appointments, doctors to manage consultations and patient records, and administrators to manage the overall healthcare system through a centralized dashboard.

---

## ✨ Features

### 👤 Patient

* Secure registration and login
* JWT-based authentication
* Doctor search and discovery
* Search by specialization
* Doctor profile and availability
* Real-time appointment slot selection
* Appointment booking
* Appointment cancellation
* Appointment history
* Medical records
* Prescriptions
* Notifications
* Profile management
* Personalized patient dashboard

### 👨‍⚕️ Doctor

* Secure doctor authentication
* Professional profile management
* Weekly availability management
* Automatic 30-minute appointment slot generation
* Today's appointments
* Upcoming appointments
* Appointment confirmation
* Appointment rejection
* Appointment completion
* Patient information
* Medical diagnosis and notes
* Medical record management
* Prescription management
* Doctor dashboard and analytics

### 🛡️ Admin

* Admin authentication
* System dashboard
* Patient management
* Doctor management
* Doctor approval/deactivation
* Appointment management
* Appointment monitoring
* System statistics
* Appointment analytics
* Audit/activity logs
* Reports and insights

---

## 🚀 Advanced Features

### 🔐 Authentication & Authorization

* JWT authentication
* Secure password hashing
* Role-based access control
* Protected frontend routes
* Protected FastAPI endpoints
* Resource-level authorization
* Secure environment configuration

### 📅 Smart Appointment Scheduling

* Doctor weekly availability
* Multiple availability periods
* Automatic appointment slot generation
* 30-minute appointment duration
* Past-slot validation
* Availability validation
* Appointment status workflow
* Cancellation handling

### 🚫 Double-Booking Prevention

The system validates appointment availability at multiple levels:

```text
Patient selects slot
        ↓
Frontend availability check
        ↓
FastAPI validation
        ↓
PostgreSQL verification
        ↓
Transaction / constraint protection
        ↓
Appointment created
```

If another appointment already exists for the same doctor, date, and time, the system returns:

```text
HTTP 409 Conflict
```

---

## 🏥 Medical Management

The platform supports:

* Patient medical profiles
* Medical history
* Doctor notes
* Diagnosis
* Treatment notes
* Follow-up recommendations
* Prescriptions
* Medication dosage
* Medication duration
* Instructions

Access to sensitive medical information is protected using role-based and resource-level authorization.

---

## 🔔 Notification System

The application provides notifications for:

* Appointment booking
* Appointment confirmation
* Appointment rejection
* Appointment cancellation
* Appointment completion
* Appointment reminders
* New medical records
* New prescriptions

Users can view unread notifications and mark them as read.

---

## 📧 Email Notifications

The backend includes an email service abstraction for:

* Appointment confirmation
* Appointment cancellation
* Appointment rejection
* Appointment reminders
* Prescription notifications

SMTP configuration is handled using environment variables.

---

## 📊 Admin Analytics

The admin dashboard provides system-level insights including:

* Total patients
* Total doctors
* Total appointments
* Pending appointments
* Confirmed appointments
* Completed appointments
* Cancelled appointments

Analytics include:

* Appointment status distribution
* Appointment trends
* Doctor statistics
* Patient statistics

---

## 📝 Audit Logging

Important system actions are tracked through an audit log.

Examples:

* User login
* User registration
* Appointment booking
* Appointment cancellation
* Appointment confirmation
* Appointment completion
* Medical record creation
* Prescription creation
* Administrative actions

Sensitive information such as passwords and secrets is never stored in audit logs.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* React Router
* Axios
* CSS

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT
* Password Hashing

## Database

* PostgreSQL
* SQLAlchemy ORM
* Alembic

## Development & Deployment

* Git
* GitHub
* Docker
* Docker Compose
* Swagger / OpenAPI
* Postman

---

# 🏗️ System Architecture

```text
                   ┌─────────────────────┐
                   │    React Frontend   │
                   │      Vite + JS      │
                   └──────────┬──────────┘
                              │
                         REST / Axios
                              │
                              ▼
                   ┌─────────────────────┐
                   │    FastAPI Backend  │
                   │       Python        │
                   └──────────┬──────────┘
                              │
                    SQLAlchemy ORM
                              │
                              ▼
                   ┌─────────────────────┐
                   │      PostgreSQL     │
                   │       Database      │
                   └─────────────────────┘
```

---

# 👥 User Roles

```text
                    Healthcare Platform
                           │
              ┌────────────┼────────────┐
              │            │            │
           Patient       Doctor       Admin
              │            │            │
              ▼            ▼            ▼
          Book          Manage        Manage
       Appointments   Appointments    System
              │            │            │
              ▼            ▼            ▼
        Medical Data    Records      Analytics
```

---

# 📂 Project Structure

```text
healthcare-appointment-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── core/
│   │   └── utils/
│   └── requirements.txt
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── tests/
│   ├── backend/
│   └── frontend/
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_DESIGN.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── PROJECT_SETUP.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🗄️ Database Design

The system uses a relational PostgreSQL database.

Main entities:

```text
users
  │
  ├── patients
  │
  └── doctors
          │
          └── doctor_availability
          
patients ───────┐
                │
                ▼
          appointments
                ▲
                │
doctors ────────┘
                │
                ▼
        medical_records
                │
                ▼
          prescriptions

users
  │
  ├── notifications
  │
  └── audit_logs
```

---

# 🔌 REST API

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Doctors

```http
GET    /api/doctors
GET    /api/doctors/{id}
POST   /api/doctors
PUT    /api/doctors/{id}
DELETE /api/doctors/{id}
```

## Patients

```http
GET /api/patients/{id}
PUT /api/patients/{id}
```

## Appointments

```http
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/{id}
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
```

## Availability

```http
POST   /api/availability
GET    /api/availability/doctor/{doctor_id}
PUT    /api/availability/{id}
DELETE /api/availability/{id}
```

## Medical Records

```http
POST /api/medical-records
GET  /api/medical-records/patient/{patient_id}
```

## Prescriptions

```http
POST /api/prescriptions
GET  /api/prescriptions/patient/{patient_id}
```

## Notifications

```http
GET /api/notifications
PUT /api/notifications/{id}/read
PUT /api/notifications/read-all
```

## Admin

```http
GET /api/admin/statistics
GET /api/admin/patients
GET /api/admin/doctors
GET /api/admin/appointments
GET /api/admin/audit-logs
```

## Health Check

```http
GET /api/health
```

---

# 📖 API Documentation

FastAPI automatically provides interactive API documentation through Swagger.

```text
http://localhost:8000/docs
```

Alternative OpenAPI documentation:

```text
http://localhost:8000/redoc
```

---

# 🔑 Demo Accounts

The project includes demo accounts for testing.

### Admin

```text
Email: admin@healthcare.com
Password: Password123!
```

### Doctor

```text
Email: sarah.jenkins@healthcare.com
Password: Password123!
```

### Patient

```text
Email: john.doe@patient.com
Password: Password123!
```

The login interface also provides convenient:

```text
1-Click Patient
1-Click Doctor
1-Click Admin
```

demo login options.

---

# 🖥️ Application URLs

Frontend:

```text
http://localhost:5173/
```

Backend:

```text
http://localhost:8000/
```

Swagger:

```text
http://localhost:8000/docs
```

Health Check:

```text
http://localhost:8000/api/health
```

---

# ⚙️ Environment Variables

Create a `.env` file in the backend based on `.env.example`.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/healthcare_db

SECRET_KEY=your-secret-key

ACCESS_TOKEN_EXPIRE_MINUTES=60

CORS_ORIGINS=http://localhost:5173

SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
```

Never commit real credentials or secrets to GitHub.

---

# 🐳 Docker

The project includes Docker support.

Run the complete stack using Docker Compose.

```text
Frontend
    ↓
Backend
    ↓
PostgreSQL
```

Docker configuration allows the application services to be run consistently across development environments.

---

# 🧪 Testing

The project includes tests for important application functionality.

### Backend

* Authentication
* Registration
* Login
* JWT authorization
* Doctor APIs
* Patient APIs
* Appointment booking
* Availability
* Double-booking prevention
* Appointment cancellation
* Role authorization
* Medical records

### Frontend

* Login
* Doctor search
* Appointment booking
* Protected routes

---

# 🔒 Security

Security considerations implemented in the application include:

* JWT authentication
* Secure password hashing
* Role-based authorization
* Resource-level authorization
* Input validation
* PostgreSQL constraints
* SQLAlchemy ORM
* CORS configuration
* Environment-based secrets
* Protected medical records
* Secure API responses

---

# 🚀 Future Improvements

Potential future enhancements:

* Online payment integration
* Video consultation
* Real-time chat
* Calendar synchronization
* SMS notifications
* Advanced doctor recommendation
* AI-powered symptom assistance
* Prescription PDF generation
* Multi-hospital support
* Advanced reporting
* Cloud deployment
* CI/CD pipeline

---

# 🎯 Project Highlights

This project demonstrates practical experience with:

* Full-stack development
* React frontend development
* Python backend development
* FastAPI REST API development
* PostgreSQL database design
* SQLAlchemy ORM
* JWT authentication
* Role-based authorization
* Appointment scheduling
* Concurrency/double-booking protection
* Healthcare data management
* Dashboard development
* API integration
* Security
* Automated testing
* Docker
* Software architecture

---

# 👨‍💻 Author

**Devansh Sharma**

B.Tech — Computer Science / AI & ML

New Delhi, India

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐.

