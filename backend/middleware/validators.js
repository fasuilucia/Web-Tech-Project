const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware to check for validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    validate,
];

/**
 * Validation rules for user login
 */
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate,
];

/**
 * Validation rules for creating event group
 */
const createEventGroupValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Event group name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),

    body('description')
        .optional()
        .trim(),

    validate,
];

/**
 * Validation rules for creating event
 */
const createEventValidation = [
    body('eventGroupId')
        .notEmpty().withMessage('Event group ID is required')
        .isInt({ min: 1 }).withMessage('Event group ID must be a positive integer'),

    body('name')
        .trim()
        .notEmpty().withMessage('Event name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),

    body('scheduledTime')
        .notEmpty().withMessage('Scheduled time is required')
        .isISO8601().withMessage('Scheduled time must be a valid date'),

    body('duration')
        .notEmpty().withMessage('Duration is required')
        .isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),

    validate,
];

/**
 * Validation rules for confirming attendance
 */
const confirmAttendanceValidation = [
    body('accessCode')
        .trim()
        .notEmpty().withMessage('Access code is required')
        .isLength({ min: 1, max: 20 }).withMessage('Access code must be between 1 and 20 characters'),

    body('participantName')
        .trim()
        .notEmpty().withMessage('Participant name is required')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),

    body('participantEmail')
        .trim()
        .notEmpty().withMessage('Participant email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('participantPhone')
        .optional()
        .trim()
        .isLength({ max: 20 }).withMessage('Phone number must be at most 20 characters'),

    validate,
];

/**
 * Validation rules for ID parameters
 */
const idParamValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer'),

    validate,
];

/**
 * Validation rules for export format query
 */
const exportFormatValidation = [
    query('format')
        .optional()
        .isIn(['csv', 'xlsx']).withMessage('Format must be either csv or xlsx'),

    validate,
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    createEventGroupValidation,
    createEventValidation,
    confirmAttendanceValidation,
    idParamValidation,
    exportFormatValidation,
};
