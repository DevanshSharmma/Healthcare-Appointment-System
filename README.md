# MediPulse — Enterprise Healthcare Appointment & Patient Management Platform

A portfolio-grade, full-stack Healthcare SaaS platform engineered with **FastAPI**, **PostgreSQL / SQLAlchemy**, **Pydantic v2**, and **React 18 + Vite**.

Designed and built to production standards: multi-role role-based access control (Patient, Doctor, Admin), a real-time appointment scheduling engine with multi-level double-booking protection, a validated appointment lifecycle state machine with visual audit timeline, electronic medical records (EMR), multi-item digital prescriptions, live notification center with email dispatch abstraction, role-tailored dashboards, system-wide audit logging, and full containerization.

---

## Key Features

1. **Smart Doctor Discovery**:
   - Filter specialists by clinical specialty, hospital affiliation, consultation fee, minimum rating.
   - Debounced search across doctor names, qualifications, and clinics.
   - Comprehensive doctor profiles with experience, qualifications, and published weekly consultation hours.

2. **Advanced Appointment Scheduling Engine**:
   - Weekly doctor availability schedules supporting multiple working periods per day.
   - Dynamic 30-minute slot generation for any target date.
   - Active booking detection & past-slot elimination.
   - **Multi-Level Double-Booking Protection**:
     - *Frontend*: Hides already booked and past slots.
     - *Backend*: Validates availability and existing bookings prior to persistence.
     - *Database*: Active slot unique lock key `(doctor_id, date, time)` ensuring database-level integrity.
     - *Transaction*: Row-level locking catching collisions and returning `HTTP 409 Conflict`.

3. **Validated Appointment Lifecycle & Timeline**:
   - Strict state transitions:
     - `PENDING` &rarr; `CONFIRMED` &rarr; `COMPLETED`
     - `PENDING` &rarr; `REJECTED`
     - `(PENDING | CONFIRMED)` &rarr; `CANCELLED`
   - Visual 4-step interactive timeline on the appointment detail page.

4. **Electronic Medical Records (EMR)**:
   - Attending doctors document primary diagnoses, symptoms, clinical examination findings, treatment plans, and recommended follow-up dates.
   - Role-based authorization protecting patient health data.

5. **Multi-Medication Digital Prescriptions**:
   - Structured multi-item prescriptions (Medicine Name, Dosage, Frequency, Duration, Instructions).
   - Instant patient portal access with print-friendly summaries.

6. **Notification Center & Email Service**:
   - Live in-app notifications with unread counter badges.
   - Automatic dispatch on booking, confirmation, rejection, cancellation, and prescription generation.
   - Email service abstraction supporting real SMTP and development logging mode.

7. **Role-Tailored Dashboards**:
   - **Patient Dashboard**: Upcoming consultations, quick cancellations, clinical summaries, and active prescriptions.
   - **Doctor Dashboard**: Today's schedule, pending request triage (Confirm/Reject), consultation completion, and availability management.
   - **Admin Dashboard**: Executive KPI telemetry, status breakdown graphs, monthly trends, doctor credential approvals, patient directory, and live security audit trail.

8. **Security & Regulatory Compliance**:
   - Strong password hashing with `bcrypt` (12 rounds).
   - Signed JSON Web Tokens (JWT).
   - Immutable security audit logs tracking user, action, entity, entity ID, details, and IP address.
   - Centralized error handlers preventing raw backend stack trace leakage.

---

## Demo Credentials & 1-Click Fast Logins

The application features **1-Click Demo Logins** on the login page performing genuine authentication against the `/api/auth/login` endpoint:

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@healthcare.com` | `Password123!` | System oversight, doctor approvals, analytics, audit stream |
| **Doctor** | `sarah.jenkins@healthcare.com` | `Password123!` | Cardiology specialist, appointment triage, EMR, prescriptions |
| **Patient** | `john.doe@patient.com` | `Password123!` | Appointment discovery, slot booking, medical record viewing |

*Additional 4 specialized doctors and 9 patients are seeded in the database.*

---

## Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide Icons, Modern CSS Design Tokens.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PyJWT, bcrypt.
- **Database**: PostgreSQL (Production & Docker Compose) with resilient local SQLite fallback (`healthcare.db`).
- **Containerization**: Docker, Docker Compose, Nginx.

---

## Local Development Setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m backend.main
```
Backend runs at `http://localhost:8000`.  
Interactive OpenAPI/Swagger documentation available at `http://localhost:8000/docs`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 3. Docker Compose (Full Stack with PostgreSQL)
```bash
docker-compose up --build
```

### 4. Running Automated Tests
```bash
pytest backend/tests -v
```
