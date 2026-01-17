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

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// API Routes
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

        // Start Express server - bind to 0.0.0.0 for Railway
        app.listen(PORT, HOST, () => {
            console.log(`✓ Server running on ${HOST}:${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        });
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
