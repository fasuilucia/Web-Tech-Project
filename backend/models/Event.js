const { DataTypes } = require('sequelize');

/**
 * Event model - represents a single event with access code and state
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Event model
 */
module.exports = (sequelize) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        event_group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'event_groups',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        scheduled_time: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
            },
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                isInt: true,
            },
            comment: 'Duration in minutes',
        },
        state: {
            type: DataTypes.ENUM('CLOSED', 'OPEN'),
            defaultValue: 'CLOSED',
            allowNull: false,
        },
        access_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        qr_code_data: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Base64 encoded QR code image data URL',
        },
    }, {
        tableName: 'events',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['access_code'],
            },
            {
                fields: ['state'],
            },
            {
                fields: ['scheduled_time'],
            },
        ],
    });

    /**
     * Instance method to check if event should be open
     * @returns {boolean} True if current time is within event window
     */
    Event.prototype.shouldBeOpen = function () {
        const now = new Date();
        const scheduledTime = new Date(this.scheduled_time);
        const endTime = new Date(scheduledTime.getTime() + this.duration * 60000);

        return now >= scheduledTime && now <= endTime;
    };

    /**
     * Instance method to get end time
     * @returns {Date} Event end time
     */
    Event.prototype.getEndTime = function () {
        const scheduledTime = new Date(this.scheduled_time);
        return new Date(scheduledTime.getTime() + this.duration * 60000);
    };

    return Event;
};
