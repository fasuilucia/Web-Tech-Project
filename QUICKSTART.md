# Quick Start Guide - No Installation Required!

This guide gets you running **without installing PostgreSQL**. The app uses SQLite for local development.

## Prerequisites

✅ **Node.js** - Already installed (you have npm)
✅ **Git** - Already installed (you have the repo)

That's it! No database installation needed.

## Setup Steps

### 1. Install Dependencies

**Backend:**
```powershell
cd C:\WTProject\Web-Tech-Project\backend
npm install
```

**Frontend:**
```powershell
cd C:\WTProject\Web-Tech-Project\frontend
npm install
```

### 2. Configure Environment Variables

**Backend:**
```powershell
cd C:\WTProject\Web-Tech-Project\backend
copy .env.example .env
```

Edit `backend\.env` - **Only set these minimum values:**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=my_super_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

**Frontend:**
```powershell
cd C:\WTProject\Web-Tech-Project\frontend
copy .env.example .env
```
(No changes needed - default is fine)

### 3. Create Database (Automatic with SQLite!)

```powershell
cd C:\WTProject\Web-Tech-Project\backend
npm run migrate
```

This creates a `database.sqlite` file automatically - no PostgreSQL needed!

### 4. Start the Application

**Terminal 1 - Backend:**
```powershell
cd C:\WTProject\Web-Tech-Project\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd C:\WTProject\Web-Tech-Project\frontend
npm start
```

The app will open at `http://localhost:3000`

## Test the Application

1. **Register** a new account
2. **Create an Event Group**
3. **Create an Event** (set time 2 minutes in future)
4. **Wait for event to open** (state changes automatically)
5. **Go to** `/attend` to test attendance
6. **Check attendee list** in event details

## Email Notifications (Optional)

Email confirmations are **optional**. To enable:

1. Get a Gmail App Password: https://myaccount.google.com/apppasswords
2. Add to `backend\.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@attendance.com
```

Without email config, attendance still works - you just won't get confirmation emails.

## Troubleshooting

**Port already in use?**
- Change `PORT=5000` to `PORT=5001` in `backend\.env`

**Database errors?**
- Delete `backend/database.sqlite`
- Run `npm run migrate` again

**Frontend won't start?**
- Make sure backend is running first
- Check `REACT_APP_API_URL` in `frontend\.env`

## For Production Deployment

When deploying to Railway/Vercel, the app will automatically use PostgreSQL (configured in production environment). SQLite is only for local development.

---

**That's it!** No PostgreSQL, no complex setup. Just npm install and go! 🚀
