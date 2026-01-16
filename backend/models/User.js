const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

/**
 * User model - represents event organizers
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} User model
 */
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                len: [3, 50],
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
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [6, 255],
            },
        },
        role: {
            type: DataTypes.STRING(20),
            defaultValue: 'organizer',
            validate: {
                isIn: [['organizer', 'admin']],
            },
        },
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true,
        hooks: {
            /**
             * Hash password before creating user
             */
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            /**
             * Hash password before updating user if password changed
             */
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    });

    /**
     * Instance method to validate password
     * @param {string} password - Plain text password to validate
     * @returns {Promise<boolean>} True if password matches
     */
    User.prototype.validatePassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    /**
     * Instance method to get user data without password
     * @returns {Object} User object without password
     */
    User.prototype.toJSON = function () {
        const values = { ...this.get() };
        delete values.password;
        return values;
    };

    return User;
};
