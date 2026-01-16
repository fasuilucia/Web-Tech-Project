import { format, formatDistance, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format date for datetime-local input
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string for input
 */
export const formatForInput = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFuture = (date) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj > new Date();
};
