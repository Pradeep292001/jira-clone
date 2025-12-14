import React from 'react';

const Avatar = ({ user, size = 'md', className = '' }) => {
    if (!user) return null;

    const sizeClass = `avatar-${size}`;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`avatar ${sizeClass} ${className}`}>
            {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
            ) : (
                <span>{getInitials(user.name)}</span>
            )}
        </div>
    );
};

export default Avatar;
