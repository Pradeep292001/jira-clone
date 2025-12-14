import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '0.75rem 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(30, 41, 59, 0.9)'
        }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none'
                    }}>
                        Jira Clone
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'background var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Avatar user={user} size="sm" />
                            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                {user?.name}
                            </span>
                            <span style={{ color: 'var(--color-text-muted)' }}>▼</span>
                        </button>

                        {showUserMenu && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '0.5rem',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)',
                                minWidth: '200px',
                                overflow: 'hidden',
                                animation: 'slideDown var(--transition-base)'
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                        {user?.name}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                        {user?.email}
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        borderRadius: 0,
                                        border: 'none'
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
