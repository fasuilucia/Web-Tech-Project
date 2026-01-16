import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { attendanceAPI } from '../../services/api';

/**
 * Attendance Input Component
 * Public page for participants to confirm attendance
 */
const AttendanceInput = () => {
    const [method, setMethod] = useState('manual'); // 'manual' or 'qr'
    const [formData, setFormData] = useState({
        accessCode: '',
        participantName: '',
        participantEmail: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanner, setScanner] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await attendanceAPI.confirm(formData);
            setSuccess(true);
            setFormData({ accessCode: '', participantName: '', participantEmail: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to confirm attendance');
        }

        setLoading(false);
    };

    const startQRScanner = () => {
        setMethod('qr');
        setTimeout(() => {
            const html5QrcodeScanner = new Html5QrcodeScanner(
                'qr-reader',
                { fps: 10, qrbox: 250 },
                false
            );

            html5QrcodeScanner.render(
                (decodedText) => {
                    setFormData({ ...formData, accessCode: decodedText });
                    setMethod('manual');
                    html5QrcodeScanner.clear();
                },
                (error) => {
                    // Ignore errors during scanning
                }
            );

            setScanner(html5QrcodeScanner);
        }, 100);
    };

    const stopQRScanner = () => {
        if (scanner) {
            scanner.clear();
        }
        setMethod('manual');
    };

    if (success) {
        return (
            <div className="container" style={{ maxWidth: '600px', marginTop: '4rem' }}>
                <div className="card text-center fade-in">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                    <h2 className="text-success">Attendance Confirmed!</h2>
                    <p className="text-gray">
                        Your attendance has been successfully recorded. You should receive a confirmation email shortly.
                    </p>
                    <button
                        className="btn btn-primary mt-lg"
                        onClick={() => {
                            setSuccess(false);
                            setFormData({ accessCode: '', participantName: '', participantEmail: '' });
                        }}
                    >
                        Confirm Another Attendance
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '4rem' }}>
            <div className="card fade-in">
                <div className="card-header">
                    <h2 className="card-title text-center">Confirm Attendance</h2>
                    <p className="text-center text-gray">
                        Enter the access code or scan the QR code to confirm your attendance
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {/* Method Selection */}
                <div className="flex gap-md mb-lg">
                    <button
                        className={`btn ${method === 'manual' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => {
                            stopQRScanner();
                            setMethod('manual');
                        }}
                        style={{ flex: 1 }}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`btn ${method === 'qr' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={startQRScanner}
                        style={{ flex: 1 }}
                    >
                        Scan QR Code
                    </button>
                </div>

                {method === 'qr' && (
                    <div id="qr-reader" className="mb-lg" style={{ width: '100%' }}></div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Access Code</label>
                        <input
                            type="text"
                            name="accessCode"
                            className="form-input"
                            value={formData.accessCode}
                            onChange={handleChange}
                            required
                            placeholder="Enter access code"
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                            type="text"
                            name="participantName"
                            className="form-input"
                            value={formData.participantName}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your Email</label>
                        <input
                            type="email"
                            name="participantEmail"
                            className="form-input"
                            value={formData.participantEmail}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Confirming...' : 'Confirm Attendance'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AttendanceInput;
