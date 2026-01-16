# Attendance Monitoring Backend

RESTful API backend for the Attendance Monitoring Web Application.

## Features

- **User Authentication**: JWT-based authentication for event organizers
- **Event Management**: Create and manage event groups and events
- **Access Codes**: Automatic generation of alphanumeric codes and QR codes
- **State Management**: Automatic event state transitions (CLOSED → OPEN → CLOSED)
- **Attendance Tracking**: Record and monitor participant attendance
- **Data Export**: Export attendance data in CSV and XLSX formats
- **Email Notifications**: Send confirmation emails using Nodemailer

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer
- **QR Codes**: qrcode library
- **Export**: csv-writer, xlsx
- **Scheduling**: node-cron

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd Web-Tech-Project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - Database credentials (PostgreSQL)
   - JWT secret key
   - Email service credentials (Gmail or other SMTP)
   - Frontend URL for CORS

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE attendance_monitoring;
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
Server will start on `http://localhost:5000` with auto-reload on file changes.

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new organizer
- `POST /api/auth/login` - Login and get JWT token

### Event Groups
- `POST /api/event-groups` - Create event group
- `GET /api/event-groups` - List all event groups
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
- `GET /api/attendance/export/:eventId?format=csv|xlsx` - Export event attendance
- `GET /api/attendance/export/group/:groupId?format=csv|xlsx` - Export group attendance

## Project Structure

```
backend/
├── config/
│   └── database.js          # Sequelize configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validators.js        # Request validation middleware
├── migrations/
│   └── 20260117000000-create-tables.js  # Database migrations
├── models/
│   ├── index.js             # Sequelize initialization
│   ├── User.js              # User model
│   ├── EventGroup.js        # EventGroup model
│   ├── Event.js             # Event model
│   ├── Participant.js       # Participant model
│   └── Attendance.js        # Attendance model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── eventGroups.js       # Event group routes
│   ├── events.js            # Event routes
│   └── attendance.js        # Attendance routes
├── services/
│   ├── codeGenerator.js     # Access code & QR code generation
│   ├── eventStateManager.js # Automatic event state transitions
│   ├── emailService.js      # Email notifications
│   └── exportService.js     # CSV/XLSX export
├── .env.example             # Environment variables template
├── .sequelizerc             # Sequelize CLI configuration
├── package.json             # Dependencies and scripts
└── server.js                # Main application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | attendance_monitoring |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASSWORD` | SMTP password/app password | - |
| `EMAIL_FROM` | Sender email address | - |

## Database Schema

### Users
- Event organizers with authentication

### Event Groups
- Collections of related events
- Owned by users

### Events
- Individual events with scheduling
- Access codes and QR codes
- State management (CLOSED/OPEN)

### Participants
- Event attendees (no authentication required)

### Attendance
- Links participants to events
- Tracks confirmation timestamps

## Features in Detail

### Event State Management
Events automatically transition states based on scheduled time and duration:
- **CLOSED**: Before scheduled time or after duration expires
- **OPEN**: During the event (scheduled_time to scheduled_time + duration)

The `eventStateManager` service runs every minute to update event states.

### Access Code Generation
Each event gets:
- Unique 8-character alphanumeric code
- QR code (400x400px PNG, base64 encoded)

### Email Notifications
Participants receive confirmation emails when attendance is recorded (non-blocking, failures don't affect attendance recording).

### Data Export
Attendance can be exported as:
- **CSV**: Comma-separated values
- **XLSX**: Excel format

Exports include: Event name, Participant name, Email, Confirmation timestamp

## Deployment

### Railway (Recommended)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and initialize:
   ```bash
   railway login
   railway init
   ```

3. Add PostgreSQL:
   ```bash
   railway add
   # Select PostgreSQL
   ```

4. Set environment variables in Railway dashboard

5. Deploy:
   ```bash
   railway up
   ```

### Other Platforms
The application works with any Node.js hosting platform that supports:
- Node.js 14+
- PostgreSQL database
- Environment variables

## Development

### Code Style
- Use camelCase for variables and functions
- Add comments for all functions and classes
- Follow existing code structure

### Adding New Routes
1. Create route file in `routes/`
2. Add validation in `middleware/validators.js`
3. Mount route in `server.js`

### Database Changes
1. Create migration file in `migrations/`
2. Update corresponding model in `models/`
3. Run migration: `npm run migrate`

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Email Not Sending
- Verify SMTP credentials
- For Gmail, use App Password (not regular password)
- Check EMAIL_HOST and EMAIL_PORT settings

### Port Already in Use
- Change PORT in `.env`
- Kill process using port 5000: `netstat -ano | findstr :5000`

## License

ISC
