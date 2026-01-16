# Attendance Monitoring Frontend

React-based Single Page Application for the Attendance Monitoring System.

## Features

- **User Authentication**: Login and registration for event organizers
- **Dashboard**: Overview of event groups and statistics
- **Event Management**: Create and manage event groups and events
- **QR Code Display**: Show QR codes and access codes for events
- **Attendance Input**: Public page for participants to confirm attendance
- **QR Code Scanning**: Camera-based QR code scanning on mobile devices
- **Real-time Updates**: Auto-refreshing attendee lists
- **Data Export**: Download attendance data in CSV/XLSX formats
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **QR Codes**: qrcode.react, html5-qrcode
- **Date Handling**: date-fns
- **Styling**: Custom CSS with CSS variables

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running backend server

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Running the Application

### Development Mode
```bash
npm start
```
Application will open at `http://localhost:3000` with hot reload.

### Production Build
```bash
npm run build
```
Creates optimized production build in `build/` directory.

## Project Structure

```
frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js     # Login page
│   │   │   └── Register.js  # Registration page
│   │   ├── Dashboard/
│   │   │   └── Dashboard.js # Main dashboard
│   │   ├── EventGroups/
│   │   │   └── EventGroupDetails.js # Event group details
│   │   ├── Events/
│   │   │   └── EventDetails.js # Event details with QR code
│   │   ├── Attendance/
│   │   │   └── AttendanceInput.js # Public attendance page
│   │   └── Layout/
│   │       ├── Navbar.js    # Navigation bar
│   │       └── Navbar.css   # Navbar styles
│   ├── context/
│   │   └── AuthContext.js   # Authentication context
│   ├── services/
│   │   └── api.js           # API service with Axios
│   ├── utils/
│   │   └── dateHelpers.js   # Date formatting utilities
│   ├── App.js               # Main app component with routing
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
└── package.json             # Dependencies and scripts
```

## Key Features

### Authentication
- JWT-based authentication
- Persistent login (localStorage)
- Protected routes for organizers
- Public routes for attendance

### Dashboard
- Event group overview
- Statistics cards
- Quick actions
- Create/delete event groups

### Event Management
- Create events with scheduling
- Automatic access code generation
- QR code generation
- Event state indicators (OPEN/CLOSED)
- Real-time attendee lists

### Attendance Confirmation
- Two input methods:
  - Manual code entry
  - QR code scanning (camera)
- Participant information collection
- Success confirmation
- Email notifications (backend)

### Data Export
- Export single event attendance
- Export entire event group attendance
- CSV and XLSX formats
- Automatic file download

## Responsive Design

The application is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components adapt to screen size with:
- Flexible layouts
- Touch-friendly buttons
- Readable typography
- Optimized spacing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | http://localhost:5000/api |

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   - `REACT_APP_API_URL`: Your deployed backend URL

### Netlify

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy `build/` directory to Netlify

3. Set environment variable:
   - `REACT_APP_API_URL`: Your deployed backend URL

### Other Platforms

The application can be deployed to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Azure Static Web Apps

## Development

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Add comments for complex logic

### Adding New Components
1. Create component file in appropriate directory
2. Import and use in parent component or routing
3. Add necessary styles (inline or separate CSS file)

### State Management
- Local state with `useState` for component-specific data
- Context API (`AuthContext`) for global authentication state
- No external state management library needed for this scope

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: QR code scanning requires HTTPS in production and camera permissions.

## Troubleshooting

### API Connection Issues
- Verify backend is running
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

### QR Code Scanning Not Working
- Ensure HTTPS is enabled (required for camera access)
- Grant camera permissions in browser
- Use localhost for development (treated as secure)

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## License

ISC
