import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventGroupsAPI, eventsAPI, attendanceAPI } from '../../services/api';
import { formatDate } from '../../utils/dateHelpers';

/**
 * Event Group Details Component
 * Shows all events in a group and allows creating new events
 */
const EventGroupDetails = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        name: '',
        scheduledTime: '',
        duration: 60,
    });

    const fetchGroupDetails = useCallback(async () => {
        try {
            const response = await eventGroupsAPI.getById(id);
            setGroup(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load event group');
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await eventsAPI.create({
                eventGroupId: parseInt(id),
                ...newEvent,
            });
            setNewEvent({ name: '', scheduledTime: '', duration: 60 });
            setShowCreateModal(false);
            fetchGroupDetails();
        } catch (err) {
            setError('Failed to create event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }
        try {
            await eventsAPI.delete(eventId);
            fetchGroupDetails();
        } catch (err) {
            setError('Failed to delete event');
        }
    };

    const handleExportGroup = async (format) => {
        try {
            const response = await attendanceAPI.exportGroup(id, format);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `group_${id}_attendance.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to export attendance');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="container">
                <div className="alert alert-error">Event group not found</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-xl">
                <div>
                    <Link to="/dashboard" className="text-primary mb-sm" style={{ display: 'block' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1>{group.name}</h1>
                    <p className="text-gray">{group.description || 'No description'}</p>
                </div>
                <div className="flex gap-md">
                    <button className="btn btn-secondary" onClick={() => handleExportGroup('csv')}>
                        Export CSV
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleExportGroup('xlsx')}>
                        Export XLSX
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        + Create Event
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Events List */}
            {!group.events || group.events.length === 0 ? (
                <div className="card text-center">
                    <h3>No events yet</h3>
                    <p className="text-gray">Create your first event in this group</p>
                </div>
            ) : (
                <div className="grid grid-2">
                    {group.events.map((event) => (
                        <div key={event.id} className="card">
                            <div className="flex justify-between items-center mb-md">
                                <h3>{event.name}</h3>
                                <span className={`badge ${event.state === 'OPEN' ? 'badge-success' : 'badge-danger'}`}>
                                    {event.state}
                                </span>
                            </div>
                            <p className="text-gray text-sm mb-sm">
                                📅 {formatDate(event.scheduled_time)}
                            </p>
                            <p className="text-gray text-sm mb-md">
                                ⏱️ Duration: {event.duration} minutes
                            </p>
                            <div className="flex gap-sm">
                                <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">
                                    View Details
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="card"
                        style={{ maxWidth: '500px', width: '100%', margin: '1rem' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Create Event</h2>
                        <form onSubmit={handleCreateEvent}>
                            <div className="form-group">
                                <label className="form-label">Event Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Scheduled Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-input"
                                    value={newEvent.scheduledTime}
                                    onChange={(e) => setNewEvent({ ...newEvent, scheduledTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={newEvent.duration}
                                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="flex gap-md">
                                <button type="submit" className="btn btn-primary">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventGroupDetails;
