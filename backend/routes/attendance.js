const express = require('express');
const router = express.Router();
const { Event, Participant, Attendance, EventGroup } = require('../models');
const { authenticate } = require('../middleware/auth');
const { confirmAttendanceValidation, idParamValidation, exportFormatValidation } = require('../middleware/validators');
const emailService = require('../services/emailService');
const exportService = require('../services/exportService');
const path = require('path');

/**
 * @route   POST /api/attendance/confirm
 * @desc    Confirm attendance at an event using access code
 * @access  Public
 */
router.post('/confirm', confirmAttendanceValidation, async (req, res) => {
    try {
        const { accessCode, participantName, participantEmail, participantPhone } = req.body;

        // Find event by access code
        const event = await Event.findOne({
            where: { access_code: accessCode },
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Invalid access code',
            });
        }

        // Check if event is OPEN
        if (event.state !== 'OPEN') {
            return res.status(400).json({
                success: false,
                message: 'Event is not currently open for attendance confirmation',
                eventState: event.state,
            });
        }

        // Find or create participant
        let participant = await Participant.findOne({
            where: { email: participantEmail },
        });

        if (!participant) {
            participant = await Participant.create({
                name: participantName,
                email: participantEmail,
                phone: participantPhone || null,
            });
        } else {
            // Update participant info if changed
            await participant.update({
                name: participantName,
                phone: participantPhone || participant.phone,
            });
        }

        // Check if attendance already exists
        const existingAttendance = await Attendance.findOne({
            where: {
                event_id: event.id,
                participant_id: participant.id,
            },
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already confirmed for this event',
                confirmedAt: existingAttendance.confirmed_at,
            });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            event_id: event.id,
            participant_id: participant.id,
            confirmed_at: new Date(),
        });

        // Send confirmation email (non-blocking)
        emailService.sendAttendanceConfirmation({
            to: participantEmail,
            participantName,
            eventName: event.name,
            confirmedAt: attendance.confirmed_at,
        }).catch(err => console.error('Failed to send email:', err));

        res.status(201).json({
            success: true,
            message: 'Attendance confirmed successfully',
            data: {
                event: {
                    id: event.id,
                    name: event.name,
                },
                participant: {
                    id: participant.id,
                    name: participant.name,
                    email: participant.email,
                },
                confirmedAt: attendance.confirmed_at,
            },
        });
    } catch (error) {
        console.error('Error confirming attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm attendance',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/attendance/export/:eventId
 * @desc    Export attendance for a single event
 * @access  Private
 */
router.get('/export/:eventId', authenticate, idParamValidation, exportFormatValidation, async (req, res) => {
    try {
        const format = req.query.format || 'csv';
        const eventId = req.params.eventId;

        // Verify event belongs to user
        const event = await Event.findByPk(eventId, {
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
                        },
                    ],
                },
            ],
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Format attendance data
        const formattedData = exportService.formatAttendanceData(event.attendances);

        if (formattedData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No attendance records found for this event',
            });
        }

        // Generate export file
        const filename = `event_${eventId}_attendance_${Date.now()}`;
        let filePath;

        if (format === 'xlsx') {
            filePath = await exportService.exportToXLSX(formattedData, filename);
        } else {
            filePath = await exportService.exportToCSV(formattedData, filename);
        }

        // Send file
        res.download(filePath, path.basename(filePath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            // Clean up file after sending (optional)
            // fs.unlink(filePath).catch(console.error);
        });
    } catch (error) {
        console.error('Error exporting attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export attendance',
            error: error.message,
        });
    }
});

/**
 * @route   GET /api/attendance/export/group/:groupId
 * @desc    Export attendance for all events in a group
 * @access  Private
 */
router.get('/export/group/:groupId', authenticate, idParamValidation, exportFormatValidation, async (req, res) => {
    try {
        const format = req.query.format || 'csv';
        const groupId = req.params.groupId;

        // Verify event group belongs to user
        const eventGroup = await EventGroup.findOne({
            where: {
                id: groupId,
                organizer_id: req.userId,
            },
            include: [
                {
                    model: Event,
                    as: 'events',
                    include: [
                        {
                            model: Attendance,
                            as: 'attendances',
                            include: [
                                {
                                    model: Participant,
                                    as: 'participant',
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!eventGroup) {
            return res.status(404).json({
                success: false,
                message: 'Event group not found',
            });
        }

        // Collect all attendance records from all events
        const allAttendances = [];
        eventGroup.events.forEach(event => {
            event.attendances.forEach(attendance => {
                allAttendances.push({
                    ...attendance.toJSON(),
                    event: { name: event.name },
                });
            });
        });

        if (allAttendances.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No attendance records found for this event group',
            });
        }

        // Format attendance data
        const formattedData = exportService.formatAttendanceData(allAttendances);

        // Generate export file
        const filename = `group_${groupId}_attendance_${Date.now()}`;
        let filePath;

        if (format === 'xlsx') {
            filePath = await exportService.exportToXLSX(formattedData, filename);
        } else {
            filePath = await exportService.exportToCSV(formattedData, filename);
        }

        // Send file
        res.download(filePath, path.basename(filePath), (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
        });
    } catch (error) {
        console.error('Error exporting group attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export group attendance',
            error: error.message,
        });
    }
});

module.exports = router;
