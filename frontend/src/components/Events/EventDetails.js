import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI, attendanceAPI } from '../../services/api';
import { formatDate, formatRelativeTime } from '../../utils/dateHelpers';
import { QRCodeSVG } from 'qrcode.react';

/**
 * Event Details Component
 * Shows event details, QR code, access code, and attendee list
 */
const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEventDetails = useCallback(async () => {
        try {
            const response = await eventsAPI.getById(id);
            setEvent(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load event');
            setLoading(false);
        }
    }, [id]);

    const fetchAttendees = useCallback(async () => {
        try {
            const response = await eventsAPI.getAttendees(id);
            setAttendees(response.data.data.attendees);
        } catch (err) {
            console.error('Failed to load attendees');
        }
    }, [id]);

    useEffect(() => {
        fetchEventDetails();
        fetchAttendees();

        // Refresh attendees every 10 seconds
        const interval = setInterval(fetchAttendees, 10000);
        return () => clearInterval(interval);
    }, [fetchEventDetails, fetchAttendees]);

    const handleExport = async (format) => {
        try {
            const response = await attendanceAPI.exportEvent(id, format);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `event_${id}_attendance.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to export attendance');
        }
    };

    const copyAccessCode = () => {
        navigator.clipboard.writeText(event.access_code);
        alert('Access code copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container">
                <div className="alert alert-error">Event not found</div>
            </div>
        );
    }

    return (
        <div className="container">
            <Link to={`/groups/${event.event_group_id}`} className="text-primary mb-md" style={{ display: 'block' }}>
                ← Back to Event Group
            </Link>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid grid-2 mb-xl">
                {/* Event Info */}
                <div className="card">
                    <h2>{event.name}</h2>
                    <div className="mb-md">
                        <span className={`badge ${event.state === 'OPEN' ? 'badge-success' : 'badge-danger'}`}>
                            {event.state}
                        </span>
                    </div>
                    <p className="text-gray mb-sm">
                        📅 <strong>Scheduled:</strong> {formatDate(event.scheduled_time)}
                    </p>
                    <p className="text-gray mb-sm">
                        ⏱️ <strong>Duration:</strong> {event.duration} minutes
                    </p>
                    <p className="text-gray mb-lg">
                        👥 <strong>Attendees:</strong> {attendees.length}
                    </p>

                    <div className="flex gap-md">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleExport('csv')}>
                            Export CSV
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleExport('xlsx')}>
                            Export XLSX
                        </button>
                    </div>
                </div>

                {/* QR Code & Access Code */}
                <div className="card text-center">
                    <h3 className="mb-md">Access Code</h3>
                    <div className="qr-code-container">
                        <QRCodeSVG value={event.access_code} size={200} />
                    </div>
                    <div className="mt-lg">
                        <p className="text-gray mb-sm">Text Code:</p>
                        <h2 className="text-primary font-bold">{event.access_code}</h2>
                        <button className="btn btn-outline btn-sm mt-md" onClick={copyAccessCode}>
                            📋 Copy Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendees List */}
            <div className="card">
                <h3 className="mb-lg">Attendees ({attendees.length})</h3>
                {attendees.length === 0 ? (
                    <p className="text-center text-gray">No attendees yet</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Confirmed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.map((attendance) => (
                                <tr key={attendance.id}>
                                    <td>{attendance.participant.name}</td>
                                    <td>{attendance.participant.email}</td>
                                    <td>{formatRelativeTime(attendance.confirmed_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
