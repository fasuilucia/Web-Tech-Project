const express = require('express');
const router = express.Router();
const { Event, EventGroup, Attendance, Participant } = require('../models');
const { authenticate } = require('../middleware/auth');
const { createEventValidation, idParamValidation } = require('../middleware/validators');
const { generateEventCodes } = require('../services/codeGenerator');

/**
 * @route   POST /api/events
 * @desc    Create a new event with access code and QR code
 * @access  Private
 */
router.post('/', authenticate, createEventValidation, async (req, res) => {
    try {
        const { eventGroupId, name, scheduledTime, duration } = req.body;

        // Verify event group belongs to user
        const eventGroup = await EventGroup.findOne({
            where: {
                id: eventGroupId,
                organizer_id: req.userId,
            },
        });

        if (!eventGroup) {
            return res.status(404).json({
                success: false,
                message: 'Event group not found',
            });
        }

        // Generate access code and QR code
        const { accessCode, qrCodeData } = await generateEventCodes();

        // Create event
        const event = await Event.create({
            event_group_id: eventGroupId,
            name,
            scheduled_time: scheduledTime,
            duration,
            access_code: accessCode,
            qr_code_data: qrCodeData,
            state: 'CLOSED',
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (error) {
        console.error('Error creating event:', error);

        // Handle unique constraint violation for access code
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(500).json({
                success: false,
                message: 'Failed to generate unique access code. Please try again.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get event details
 * @access  Private
 */
router.get('/:id', authenticate, idParamValidation, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: EventGroup,
                    as: 'eventGroup',
                    where: { organizer_id: req.userId },
                },
            ],
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event',
            error: error.message,
        });
    }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private
 */
router.put('/:id', authenticate, idParamValidation, async (req, res) => {
    try {
        const { name, scheduledTime, duration } = req.body;

        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: EventGroup,
                    as: 'eventGroup',
                    where: { organizer_id: req.userId },
                },
            ],
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Update only provided fields
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (scheduledTime !== undefined) updateData.scheduled_time = scheduledTime;
        if (duration !== undefined) updateData.duration = duration;

        await event.update(updateData);

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: error.message,
        });
    }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private
 */
router.delete('/:id', authenticate, idParamValidation, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: EventGroup,
                    as: 'eventGroup',
                    where: { organizer_id: req.userId },
                },
            ],
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        await event.destroy();

        res.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/events/:id/attendees
 * @desc    Get list of attendees for an event
 * @access  Private
 */
router.get('/:id/attendees', authenticate, idParamValidation, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                {
                    model: EventGroup,
                    as: 'eventGroup',
                    where: { organizer_id: req.userId },
                },
                {
                    model: Attendance,
                    as: 'attendances',
                    include: [
                        {
                            model: Participant,
                            as: 'participant',
                            attributes: ['id', 'name', 'email', 'phone'],
                        },
                    ],
                    order: [['confirmed_at', 'DESC']],
                },
            ],
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.json({
            success: true,
            data: {
                event: {
                    id: event.id,
                    name: event.name,
                    scheduled_time: event.scheduled_time,
                    state: event.state,
                },
                attendees: event.attendances.map(attendance => ({
                    id: attendance.id,
                    participant: attendance.participant,
                    confirmed_at: attendance.confirmed_at,
                })),
                total: event.attendances.length,
            },
        });
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendees',
            error: error.message,
        });
    }
});

module.exports = router;
