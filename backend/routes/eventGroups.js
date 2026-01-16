const express = require('express');
const router = express.Router();
const { EventGroup, Event } = require('../models');
const { authenticate } = require('../middleware/auth');
const { createEventGroupValidation, idParamValidation } = require('../middleware/validators');

/**
 * @route   POST /api/event-groups
 * @desc    Create a new event group
 * @access  Private (requires authentication)
 */
router.post('/', authenticate, createEventGroupValidation, async (req, res) => {
    try {
        const { name, description } = req.body;

        const eventGroup = await EventGroup.create({
            name,
            description,
            organizer_id: req.userId,
        });

        res.status(201).json({
            success: true,
            message: 'Event group created successfully',
            data: eventGroup,
        });
    } catch (error) {
        console.error('Error creating event group:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event group',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/event-groups
 * @desc    Get all event groups for the authenticated organizer
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const eventGroups = await EventGroup.findAll({
            where: { organizer_id: req.userId },
            include: [
                {
                    model: Event,
                    as: 'events',
                    attributes: ['id', 'name', 'scheduled_time', 'duration', 'state'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        res.json({
            success: true,
            data: eventGroups,
        });
    } catch (error) {
        console.error('Error fetching event groups:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event groups',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/event-groups/:id
 * @desc    Get a single event group with all events
 * @access  Private
 */
router.get('/:id', authenticate, idParamValidation, async (req, res) => {
    try {
        const eventGroup = await EventGroup.findOne({
            where: {
                id: req.params.id,
                organizer_id: req.userId,
            },
            include: [
                {
                    model: Event,
                    as: 'events',
                    order: [['scheduled_time', 'ASC']],
                },
            ],
        });

        if (!eventGroup) {
            return res.status(404).json({
                success: false,
                message: 'Event group not found',
            });
        }

        res.json({
            success: true,
            data: eventGroup,
        });
    } catch (error) {
        console.error('Error fetching event group:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event group',
            error: error.message,
        });
    }
});

/**
 * @route   PUT /api/event-groups/:id
 * @desc    Update an event group
 * @access  Private
 */
router.put('/:id', authenticate, idParamValidation, createEventGroupValidation, async (req, res) => {
    try {
        const { name, description } = req.body;

        const eventGroup = await EventGroup.findOne({
            where: {
                id: req.params.id,
                organizer_id: req.userId,
            },
        });

        if (!eventGroup) {
            return res.status(404).json({
                success: false,
                message: 'Event group not found',
            });
        }

        await eventGroup.update({ name, description });

        res.json({
            success: true,
            message: 'Event group updated successfully',
            data: eventGroup,
        });
    } catch (error) {
        console.error('Error updating event group:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event group',
            error: error.message,
        });
    }
});

/**
 * @route   DELETE /api/event-groups/:id
 * @desc    Delete an event group (cascades to events)
 * @access  Private
 */
router.delete('/:id', authenticate, idParamValidation, async (req, res) => {
    try {
        const eventGroup = await EventGroup.findOne({
            where: {
                id: req.params.id,
                organizer_id: req.userId,
            },
        });

        if (!eventGroup) {
            return res.status(404).json({
                success: false,
                message: 'Event group not found',
            });
        }

        await eventGroup.destroy();

        res.json({
            success: true,
            message: 'Event group deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting event group:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event group',
            error: error.message,
        });
    }
});

module.exports = router;
