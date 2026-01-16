const { DataTypes } = require('sequelize');

/**
 * EventGroup model - represents a group of related events
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EventGroup model
 */
module.exports = (sequelize) => {
    const EventGroup = sequelize.define('EventGroup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100],
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        organizer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'event_groups',
        timestamps: true,
        underscored: true,
    });

    return EventGroup;
};
