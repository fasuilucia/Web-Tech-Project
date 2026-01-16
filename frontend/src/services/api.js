import axios from 'axios';

/**
 * Axios instance configured for the backend API
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor to add JWT token to requests
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle errors globally
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Authentication API calls
 */
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

/**
 * Event Groups API calls
 */
export const eventGroupsAPI = {
    create: (data) => api.post('/event-groups', data),
    getAll: () => api.get('/event-groups'),
    getById: (id) => api.get(`/event-groups/${id}`),
    update: (id, data) => api.put(`/event-groups/${id}`, data),
    delete: (id) => api.delete(`/event-groups/${id}`),
};

/**
 * Events API calls
 */
export const eventsAPI = {
    create: (data) => api.post('/events', data),
    getById: (id) => api.get(`/events/${id}`),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
    getAttendees: (id) => api.get(`/events/${id}/attendees`),
};

/**
 * Attendance API calls
 */
export const attendanceAPI = {
    confirm: (data) => api.post('/attendance/confirm', data),
    exportEvent: (eventId, format = 'csv') =>
        api.get(`/attendance/export/${eventId}?format=${format}`, {
            responseType: 'blob',
        }),
    exportGroup: (groupId, format = 'csv') =>
        api.get(`/attendance/export/group/${groupId}?format=${format}`, {
            responseType: 'blob',
        }),
};

export default api;
