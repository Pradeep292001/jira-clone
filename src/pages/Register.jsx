import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'developer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const { confirmPassword, ...userData } = formData;
        const result = await register(userData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-premium)',
            padding: '2rem'
        }}>
            <div className="card card-glass animate-slideUp" style={{
                maxWidth: '500px',
                width: '100%'
            }}>
                <div className="text-center mb-6">
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.5rem'
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Join and start managing projects
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-danger)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name" className="input-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email" className="input-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="role" className="input-label">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="input"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="developer">Developer</option>
                            <option value="project_manager">Project Manager</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword" className="input-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="input"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: 'var(--color-primary-light)',
                        textDecoration: 'none',
                        fontWeight: 600
                    }}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
