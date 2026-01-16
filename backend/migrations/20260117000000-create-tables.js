'use strict';

/**
 * Migration to create all tables for the attendance monitoring system
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create users table
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            role: {
                type: Sequelize.STRING(20),
                defaultValue: 'organizer',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Create event_groups table
        await queryInterface.createTable('event_groups', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            organizer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Create events table
        await queryInterface.createTable('events', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            event_group_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'event_groups',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            scheduled_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Duration in minutes',
            },
            state: {
                type: Sequelize.ENUM('CLOSED', 'OPEN'),
                defaultValue: 'CLOSED',
                allowNull: false,
            },
            access_code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            qr_code_data: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Base64 encoded QR code image data URL',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes for events table
        await queryInterface.addIndex('events', ['access_code'], {
            unique: true,
            name: 'events_access_code_unique',
        });
        await queryInterface.addIndex('events', ['state'], {
            name: 'events_state_index',
        });
        await queryInterface.addIndex('events', ['scheduled_time'], {
            name: 'events_scheduled_time_index',
        });

        // Create participants table
        await queryInterface.createTable('participants', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Create attendance table
        await queryInterface.createTable('attendance', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            event_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'events',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            participant_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'participants',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            confirmed_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add unique constraint for attendance
        await queryInterface.addConstraint('attendance', {
            fields: ['event_id', 'participant_id'],
            type: 'unique',
            name: 'unique_attendance',
        });

        // Add indexes for attendance table
        await queryInterface.addIndex('attendance', ['event_id'], {
            name: 'attendance_event_id_index',
        });
        await queryInterface.addIndex('attendance', ['participant_id'], {
            name: 'attendance_participant_id_index',
        });
    },

    async down(queryInterface, Sequelize) {
        // Drop tables in reverse order (respecting foreign key constraints)
        await queryInterface.dropTable('attendance');
        await queryInterface.dropTable('participants');
        await queryInterface.dropTable('events');
        await queryInterface.dropTable('event_groups');
        await queryInterface.dropTable('users');
    },
};
