const { DataTypes } = require('sequelize');

/**
 * Participant model - represents event attendees
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Participant model
 */
module.exports = (sequelize) => {
    const Participant = sequelize.define('Participant', {
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
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                len: [0, 20],
            },
        },
    }, {
        tableName: 'participants',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['email'],
            },
        ],
    });

    return Participant;
};
