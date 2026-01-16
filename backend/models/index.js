const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

/**
 * Initialize Sequelize instance
 * Uses DATABASE_URL in production, otherwise uses config object
 */
let sequelize;
if (dbConfig.use_env_variable && process.env[dbConfig.use_env_variable]) {
    // Production: use DATABASE_URL from Railway
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else if (dbConfig.dialect === 'sqlite') {
    // Development: use SQLite
    sequelize = new Sequelize(dbConfig);
} else {
    // Fallback: use individual config values
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig
    );
}

/**
 * Import all models
 */
const User = require('./User')(sequelize);
const EventGroup = require('./EventGroup')(sequelize);
const Event = require('./Event')(sequelize);
const Participant = require('./Participant')(sequelize);
const Attendance = require('./Attendance')(sequelize);

/**
 * Define model associations
 */

// User associations
User.hasMany(EventGroup, {
    foreignKey: 'organizer_id',
    as: 'eventGroups',
    onDelete: 'CASCADE',
});

// EventGroup associations
EventGroup.belongsTo(User, {
    foreignKey: 'organizer_id',
    as: 'organizer',
});

EventGroup.hasMany(Event, {
    foreignKey: 'event_group_id',
    as: 'events',
    onDelete: 'CASCADE',
});

// Event associations
Event.belongsTo(EventGroup, {
    foreignKey: 'event_group_id',
    as: 'eventGroup',
});

Event.hasMany(Attendance, {
    foreignKey: 'event_id',
    as: 'attendances',
    onDelete: 'CASCADE',
});

// Participant associations
Participant.hasMany(Attendance, {
    foreignKey: 'participant_id',
    as: 'attendances',
    onDelete: 'CASCADE',
});

// Attendance associations
Attendance.belongsTo(Event, {
    foreignKey: 'event_id',
    as: 'event',
});

Attendance.belongsTo(Participant, {
    foreignKey: 'participant_id',
    as: 'participant',
});

/**
 * Export database instance and models
 */
module.exports = {
    sequelize,
    Sequelize,
    User,
    EventGroup,
    Event,
    Participant,
    Attendance,
};
