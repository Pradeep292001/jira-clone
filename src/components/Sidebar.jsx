import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ projectId }) => {
    const navItems = [
        { to: '/', icon: '🏠', label: 'Dashboard', exact: true },
        { to: '/projects', icon: '📁', label: 'Projects' },
    ];

    const projectItems = projectId ? [
        { to: `/projects/${projectId}`, icon: '📊', label: 'Project Overview' },
        { to: `/projects/${projectId}/board`, icon: '📋', label: 'Board' },
        { to: `/projects/${projectId}/backlog`, icon: '📝', label: 'Backlog' },
    ] : [];

    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        color: 'var(--color-text-secondary)',
        fontWeight: 600,
        transition: 'all var(--transition-fast)',
        marginBottom: '0.25rem'
    };

    const activeLinkStyle = {
        ...linkStyle,
        background: 'var(--gradient-primary)',
        color: 'white',
        boxShadow: 'var(--shadow-md)'
    };

    return (
        <aside style={{
            width: '250px',
            background: 'var(--color-bg-secondary)',
            borderRight: '1px solid var(--color-border)',
            padding: '1.5rem 1rem',
            height: 'calc(100vh - 60px)',
            position: 'sticky',
            top: '60px',
            overflowY: 'auto'
        }}>
            <div>
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                    paddingLeft: '1rem'
                }}>
                    Main
                </div>
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                    >
                        <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </div>

            {projectItems.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.75rem',
                        paddingLeft: '1rem'
                    }}>
                        Project
                    </div>
                    {projectItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                        >
                            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
