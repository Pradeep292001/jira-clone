import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

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
                maxWidth: '450px',
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
                        Jira Clone
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Sign in to manage your projects
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
                        <label htmlFor="email" className="input-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)'
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{
                        color: 'var(--color-primary-light)',
                        textDecoration: 'none',
                        fontWeight: 600
                    }}>
                        Sign up
                    </Link>
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem'
                }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary-light)' }}>
                        Demo Credentials:
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                        Email: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>john@example.com</code>
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                        Password: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>password</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
