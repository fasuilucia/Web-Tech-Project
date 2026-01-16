const nodemailer = require('nodemailer');

/**
 * Email Service using Nodemailer
 * Sends email notifications to participants
 */
class EmailService {
    constructor() {
        this.transporter = null;
        this.initialize();
    }

    /**
     * Initialize email transporter
     */
    initialize() {
        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            console.log('Email service initialized');
        } catch (error) {
            console.error('Failed to initialize email service:', error);
        }
    }

    /**
     * Send attendance confirmation email to participant
     * @param {Object} params - Email parameters
     * @param {string} params.to - Recipient email
     * @param {string} params.participantName - Participant name
     * @param {string} params.eventName - Event name
     * @param {Date} params.confirmedAt - Confirmation timestamp
     * @returns {Promise<Object>} Email send result
     */
    async sendAttendanceConfirmation({ to, participantName, eventName, confirmedAt }) {
        try {
            if (!this.transporter) {
                console.warn('Email service not configured, skipping email');
                return null;
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@attendance-monitoring.com',
                to,
                subject: `Attendance Confirmed - ${eventName}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Attendance Confirmed</h2>
            <p>Hello ${participantName},</p>
            <p>Your attendance has been successfully confirmed for:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
              <p style="margin: 5px 0;"><strong>Confirmed at:</strong> ${new Date(confirmedAt).toLocaleString()}</p>
            </div>
            <p>Thank you for attending!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              This is an automated message from the Attendance Monitoring System.
            </p>
          </div>
        `,
                text: `
Hello ${participantName},

Your attendance has been successfully confirmed for:

Event: ${eventName}
Confirmed at: ${new Date(confirmedAt).toLocaleString()}

Thank you for attending!

---
This is an automated message from the Attendance Monitoring System.
        `,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Attendance confirmation email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending attendance confirmation email:', error);
            // Don't throw error - email is not critical
            return null;
        }
    }

    /**
     * Send event reminder email to participant
     * @param {Object} params - Email parameters
     * @param {string} params.to - Recipient email
     * @param {string} params.participantName - Participant name
     * @param {string} params.eventName - Event name
     * @param {Date} params.scheduledTime - Event scheduled time
     * @returns {Promise<Object>} Email send result
     */
    async sendEventReminder({ to, participantName, eventName, scheduledTime }) {
        try {
            if (!this.transporter) {
                console.warn('Email service not configured, skipping email');
                return null;
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || 'noreply@attendance-monitoring.com',
                to,
                subject: `Event Reminder - ${eventName}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Event Reminder</h2>
            <p>Hello ${participantName},</p>
            <p>This is a reminder for the upcoming event:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
              <p style="margin: 5px 0;"><strong>Scheduled for:</strong> ${new Date(scheduledTime).toLocaleString()}</p>
            </div>
            <p>Don't forget to confirm your attendance when the event starts!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              This is an automated message from the Attendance Monitoring System.
            </p>
          </div>
        `,
                text: `
Hello ${participantName},

This is a reminder for the upcoming event:

Event: ${eventName}
Scheduled for: ${new Date(scheduledTime).toLocaleString()}

Don't forget to confirm your attendance when the event starts!

---
This is an automated message from the Attendance Monitoring System.
        `,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Event reminder email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending event reminder email:', error);
            return null;
        }
    }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;
