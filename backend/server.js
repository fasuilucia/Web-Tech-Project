require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const eventStateManager = require('./services/eventStateManager');

// Import routes
const authRoutes = require('./routes/auth');
const eventGroupRoutes = require('./routes/eventGroups');
const eventRoutes = require('./routes/events');
const attendanceRoutes = require('./routes/attendance');

// Initialize Express app
const app = express();

// Middleware - CORS configuration for multiple Vercel URLs
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://web-tech-project-six.vercel.app',
    'https://web-tech-project-git-main-fasui-lucias-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list or matches Vercel preview pattern
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route for platform health checks
app.get('/', (req, res) => {
    res.status(200).send('Attendance Monitoring API is online');
});

// API Routes
app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin) {
        console.log(`Incoming request from origin: ${origin}`);
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/event-groups', eventGroupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Required for Railway

/**
 * Start the server
 */
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✓ Database connection established successfully');

        // Sync database models (use migrations in production)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: false });
            console.log('✓ Database models synchronized');
        }

        // Start event state manager
        eventStateManager.start();
        console.log('✓ Event state manager started');

        // Start Express server
        app.listen(Number(PORT), () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    eventStateManager.stop();
    await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    eventStateManager.stop();
    await sequelize.close();
    process.exit(0);
});

// Start the server
startServer();

module.exports = app;
