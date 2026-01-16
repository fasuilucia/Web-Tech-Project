const { DataTypes } = require('sequelize');

/**
 * Attendance model - tracks participant attendance at events
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Attendance model
 */
module.exports = (sequelize) => {
    const Attendance = sequelize.define('Attendance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        participant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'participants',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        confirmed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'attendance',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['event_id', 'participant_id'],
                name: 'unique_attendance',
            },
            {
                fields: ['event_id'],
            },
            {
                fields: ['participant_id'],
            },
        ],
    });

    return Attendance;
};
