# Attendance Monitoring Web Application

A full-stack web application for monitoring event attendance using QR codes and access codes.

## 🌐 Live Demo

- **Frontend**: https://web-tech-project-six.vercel.app
- **Backend API**: https://web-tech-project-production.up.railway.app/api

## 📋 Overview

This application allows event organizers to create and manage events, generate QR codes for attendance tracking, and monitor participant attendance in real-time. Participants can confirm their attendance by scanning QR codes or entering access codes manually.

## ✨ Features

- **Event Management**: Create event groups and individual events with scheduling
- **Automatic Code Generation**: Unique access codes and QR codes for each event
- **State Management**: Events automatically transition between CLOSED and OPEN states
- **Attendance Tracking**: Real-time monitoring of participant attendance
- **QR Code Scanning**: Mobile-friendly QR code scanning for quick check-in
- **Data Export**: Export attendance data in CSV and XLSX formats
- **Email Notifications**: Automatic confirmation emails to participants
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **QR Codes**: qrcode library
- **Export**: csv-writer, xlsx
- **Scheduling**: node-cron

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **QR Codes**: qrcode.react, html5-qrcode
- **Date Handling**: date-fns
- **Styling**: Custom CSS with modern design system

## 📁 Project Structure

```
Web-Tech-Project/
├── backend/              # Node.js REST API
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication & validation
│   ├── migrations/      # Database migrations
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   └── server.js        # Main server file
├── frontend/            # React SPA
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # React context (Auth)
│       ├── services/    # API service
│       └── utils/       # Helper functions
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Web-Tech-Project
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   ```

3. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE attendance_monitoring;
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

### Running the Application

1. **Start the backend** (in `backend/` directory)
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend** (in `frontend/` directory)
   ```bash
   npm start
   ```
   Frontend will open at `http://localhost:3000`

## 📖 Usage Guide

### For Event Organizers

1. **Register/Login**: Create an account or login at `/login`
2. **Create Event Group**: From dashboard, click "Create Event Group"
3. **Create Event**: Within a group, click "Create Event" and set schedule
4. **Display QR Code**: Open event details to show QR code on projector
5. **Monitor Attendance**: View real-time attendee list
6. **Export Data**: Download attendance records in CSV or XLSX format

### For Participants

1. **Navigate to Attendance Page**: Go to `/attend`
2. **Choose Method**:
   - **QR Code**: Click "Scan QR Code" and point camera at displayed code
   - **Manual**: Enter the access code shown by organizer
3. **Enter Details**: Provide name and email
4. **Confirm**: Submit to record attendance

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new organizer
- `POST /api/auth/login` - Login and get JWT token

### Event Groups
- `GET /api/event-groups` - List all event groups
- `POST /api/event-groups` - Create event group
- `GET /api/event-groups/:id` - Get event group details
- `PUT /api/event-groups/:id` - Update event group
- `DELETE /api/event-groups/:id` - Delete event group

### Events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/attendees` - List event attendees

### Attendance
- `POST /api/attendance/confirm` - Confirm attendance (public)
- `GET /api/attendance/export/:eventId?format=csv|xlsx` - Export event
- `GET /api/attendance/export/group/:groupId?format=csv|xlsx` - Export group

## 🌐 Deployment

### Backend (Railway)

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add`
5. Deploy: `railway up`
6. Set environment variables in Railway dashboard

### Frontend (Vercel)

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to frontend: `cd frontend`
3. Deploy: `vercel`
4. Set `REACT_APP_API_URL` to your deployed backend URL

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=attendance_monitoring
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Manual Testing Checklist

1. ✅ User registration and login
2. ✅ Create event group
3. ✅ Create event with future scheduled time
4. ✅ Event state transitions (CLOSED → OPEN → CLOSED)
5. ✅ QR code generation and display
6. ✅ Attendance confirmation (QR scan)
7. ✅ Attendance confirmation (manual code)
8. ✅ Real-time attendee list updates
9. ✅ Export attendance (CSV/XLSX)
10. ✅ Responsive design on mobile/tablet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Push to your fork
5. Create a pull request

## 📄 License

ISC

## 👥 Authors

- Event Organizer Dashboard & Management
- Participant Attendance System
- Real-time Monitoring & Analytics

## 🙏 Acknowledgments

- Built with React and Node.js
- QR code functionality powered by qrcode and html5-qrcode libraries
- Database management with Sequelize ORM
- Email notifications via Nodemailer

---

**Note**: This is a university project for the Web Technologies course. For production use, additional security measures and optimizations should be implemented.
