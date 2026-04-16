# Exam Seating Management System (Exam Portal)

A comprehensive, full-stack web application designed to streamline the process of managing exam schedules, student seating arrangements, faculty invigilation assignments, and real-time attendance tracking.

![Project Banner](https://img.shields.io/badge/Status-Operational-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20Postgres-blue)

## 🚀 Overview

This portal serves as a centralized platform for educational institutions to automate the complex logistics of examination management. It features distinct portals for Administrators, Students, and Faculty members, ensuring a smooth and secure examination experience.

---

## ✨ Key Features

### 🛠️ Admin Dashboard
- **Admin Management:** Create and manage sub-admins with granular permissions.
- **Exam Coordination:** Schedule exams, manage branches, and define academic sessions.
- **Seating Automation:** Automatically generate seating arrangements based on student distribution.
- **Faculty Allocation:** Assign invigilators to various exam halls efficiently.
- **Reporting:** Export detailed reports in **Excel** and **PDF** formats.
- **System Monitoring:** Real-time system health dashboard and error logging.

### 🎓 Student Portal
- **Dashboard:** View personalized exam schedules and seating locations.
- **Secure Login:** Support for **OTP-based login** and **Microsoft OAuth (@vignan.ac.in)**.
- **Profile Management:** Complete and update academic details.
- **Live Status:** Check system operational status and upcoming maintenance windows.

### 👥 Faculty Portal
- **Invigilation Duties:** View assigned duties and exam hall schedules.
- **Attendance Tracking:** Record student attendance directly from the portal.
- **Malpractice Reporting:** Securely report and document exam incidents.

### 🛡️ Security & Performance
- **MFA (Multi-Factor Authentication):** Mandatory TOTP setup for sub-admins.
- **Traffic Control:** Integrated request limiting to prevent server overload.
- **Rate Limiting:** Protects sensitive endpoints (Auth, OTP) from brute-force attacks.
- **Data Protection:** Hashed passwords (Bcrypt), JWT-based authentication, and Helmet security headers.

---

## 💻 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Sequelize ORM](https://sequelize.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (or MySQL compatible)
- **Utilities:** [ExcelJS](https://github.com/exceljs/exceljs), [PDFKit](http://pdfkit.org/), [Speakeasy](https://github.com/speakeasyjs/speakeasy) (MFA), [QRCode](https://github.com/soldair/node-qrcode)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Shrxvxnxd/Exam-Portal.git
cd Exam-Portal
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (refer to `.env.example`):
   ```env
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file (refer to `.env.example`):
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_key
   ```

---

## 🐳 Docker Support

The project is fully Dockerized for easy deployment and local development.

### 🍱 Using Docker Compose (Recommended)
You can start both the backend and frontend services with a single command:
```bash
docker-compose up --build
```
This will:
- Build the backend and frontend images.
- Map the Backend to `http://localhost:5000`.
- Map the Frontend to `http://localhost:3000`.

### 🛠️ Individual Containers

#### Backend
```bash
cd backend
docker build -t exam-portal-backend .
docker run -p 5000:5000 --env-file .env exam-portal-backend
```

#### Frontend
```bash
cd frontend
docker build -t exam-portal-frontend .
docker run -p 3000:3000 exam-portal-frontend
```

---

## 🏃 Commands

### 🟢 Quick Start (Windows)
Run the following file at the root to start both Backend and Frontend simultaneously:
```bash
start-dev.bat
```

### 📦 Individual Scripts

| Service | Command | Description |
| :--- | :--- | :--- |
| **Backend** | `npm run dev` | Starts server with Nodemon (Auto-restart) |
| **Backend** | `npm start` | Starts production server |
| **Frontend** | `npm run dev` | Starts Next.js development server |
| **Frontend** | `npm run build` | Builds application for production |
| **Frontend** | `npm start` | Starts production built application |

---

## 📂 Project Structure

```text
├── backend/              # Node.js + Express API
│   ├── middleware/       # Auth & Rate limiting
│   ├── models/           # Sequelize Database Models
│   ├── routes/           # API Endpoints
│   ├── server.js         # Main Entry Point
│   └── seed_maintenance.js # Maintenance Seeding Script
├── frontend/             # Next.js Application
│   ├── app/              # Portal Pages & Routing
│   ├── components/       # UI Components
│   └── public/           # Static Assets
└── start-dev.bat         # Batch script for local development
```

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information (if applicable).

---
*Developed with ❤️ for Academic Excellence.*
