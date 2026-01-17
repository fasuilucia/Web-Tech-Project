import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventGroupsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard Component
 * Main page showing all event groups and quick stats
 */
const Dashboard = () => {
    const { user } = useAuth();
    const [eventGroups, setEventGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchEventGroups();
    }, []);

    const fetchEventGroups = async () => {
        try {
            const response = await eventGroupsAPI.getAll();
            setEventGroups(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load event groups');
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await eventGroupsAPI.create(newGroup);
            setNewGroup({ name: '', description: '' });
            setShowCreateModal(false);
            fetchEventGroups();
        } catch (err) {
            setError('Failed to create event group');
        }
    };

    const handleDeleteGroup = async (id) => {
        if (!window.confirm('Are you sure? This will delete all events in this group.')) {
            return;
        }
        try {
            await eventGroupsAPI.delete(id);
            fetchEventGroups();
        } catch (err) {
            setError('Failed to delete event group');
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-xl">
                <div>
                    <h1>Welcome, {user?.username}! 👋</h1>
                    <p className="text-gray">Manage your events and track attendance</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Create Event Group
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Stats Cards */}
            <div className="grid grid-3 mb-xl">
                <div className="card">
                    <h3 className="text-primary">{eventGroups.length}</h3>
                    <p className="text-gray">Event Groups</p>
                </div>
                <div className="card">
                    <h3 className="text-secondary">
                        {eventGroups.reduce((sum, g) => sum + (g.events?.length || 0), 0)}
                    </h3>
                    <p className="text-gray">Total Events</p>
                </div>
                <div className="card">
                    <h3 className="text-warning">
                        {eventGroups.reduce(
                            (sum, g) => sum + (g.events?.filter(e => e.state === 'OPEN').length || 0),
                            0
                        )}
                    </h3>
                    <p className="text-gray">Active Events</p>
                </div>
            </div>

            {/* Event Groups List */}
            {eventGroups.length === 0 ? (
                <div className="card text-center">
                    <h3>No event groups yet</h3>
                    <p className="text-gray">Create your first event group to get started</p>
                </div>
            ) : (
                <div className="grid grid-2">
                    {eventGroups.map((group) => (
                        <div key={group.id} className="card">
                            <div className="flex justify-between items-center mb-md">
                                <h3>{group.name}</h3>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteGroup(group.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-gray mb-md">{group.description || 'No description'}</p>
                            <div className="mb-md">
                                <span className="badge badge-primary">
                                    {group.events?.length || 0} events
                                </span>
                                {group.events?.some(e => e.state === 'OPEN') && (
                                    <span className="badge badge-success ml-sm">
                                        {group.events.filter(e => e.state === 'OPEN').length} active
                                    </span>
                                )}
                            </div>
                            <Link to={`/groups/${group.id}`} className="btn btn-outline btn-sm">
                                View Details →
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
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
                        <h2>Create Event Group</h2>
                        <form onSubmit={handleCreateGroup}>
                            <div className="form-group">
                                <label className="form-label">Group Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
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

export default Dashboard;
