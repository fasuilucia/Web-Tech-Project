import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

/**
 * Navigation Bar Component
 * Shows different options based on authentication status
 */
const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/dashboard" className="navbar-brand">
                        📊 Attendance Monitor
                    </Link>

                    <div className="navbar-menu">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                                <Link to="/attend" className="navbar-link">
                                    Mark Attendance
                                </Link>
                                <span className="navbar-user">
                                    👤 {user?.username}
                                </span>
                                <button onClick={logout} className="btn btn-sm btn-outline">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/attend" className="navbar-link">
                                    Mark Attendance
                                </Link>
                                <Link to="/login" className="btn btn-sm btn-primary">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
