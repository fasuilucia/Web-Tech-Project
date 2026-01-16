const cron = require('node-cron');
const { Event } = require('../models');
const { Op } = require('sequelize');

/**
 * Event State Manager Service
 * Automatically transitions event states based on scheduled time and duration
 */
class EventStateManager {
    constructor() {
        this.cronJob = null;
    }

    /**
     * Start the event state manager
     * Runs every minute to check and update event states
     */
    start() {
        console.log('Starting Event State Manager...');

        // Run every minute
        this.cronJob = cron.schedule('* * * * *', async () => {
            await this.updateEventStates();
        });

        // Also run immediately on startup
        this.updateEventStates();
    }

    /**
     * Stop the event state manager
     */
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            console.log('Event State Manager stopped');
        }
    }

    /**
     * Update event states based on current time
     */
    async updateEventStates() {
        try {
            const now = new Date();

            // Find events that should be OPEN but are currently CLOSED
            const eventsToOpen = await Event.findAll({
                where: {
                    state: 'CLOSED',
                    scheduled_time: {
                        [Op.lte]: now, // Scheduled time has passed
                    },
                },
            });

            // Open events that should be open
            for (const event of eventsToOpen) {
                const endTime = event.getEndTime();

                // Only open if we're still within the event duration
                if (now <= endTime) {
                    event.state = 'OPEN';
                    await event.save();
                    console.log(`Event ${event.id} (${event.name}) opened at ${now.toISOString()}`);
                }
            }

            // Find events that should be CLOSED but are currently OPEN
            const eventsToClose = await Event.findAll({
                where: {
                    state: 'OPEN',
                },
            });

            // Close events whose duration has expired
            for (const event of eventsToClose) {
                const endTime = event.getEndTime();

                if (now > endTime) {
                    event.state = 'CLOSED';
                    await event.save();
                    console.log(`Event ${event.id} (${event.name}) closed at ${now.toISOString()}`);
                }
            }
        } catch (error) {
            console.error('Error updating event states:', error);
        }
    }
}

// Create singleton instance
const eventStateManager = new EventStateManager();

module.exports = eventStateManager;
