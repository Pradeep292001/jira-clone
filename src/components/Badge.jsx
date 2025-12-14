import React from 'react';

const Badge = ({ type, children, className = '' }) => {
    const typeClass = type ? `badge-${type}` : '';

    return (
        <span className={`badge ${typeClass} ${className}`}>
            {children}
        </span>
    );
};

export const PriorityBadge = ({ priority }) => {
    const typeMap = {
        highest: 'danger',
        high: 'warning',
        medium: 'info',
        low: 'secondary',
        lowest: 'secondary'
    };

    const labelMap = {
        highest: '🔥 Highest',
        high: '⬆️ High',
        medium: '➡️ Medium',
        low: '⬇️ Low',
        lowest: '📋 Lowest'
    };

    return (
        <Badge type={typeMap[priority]}>
            {labelMap[priority] || priority}
        </Badge>
    );
};

export const StatusBadge = ({ status }) => {
    const typeMap = {
        todo: 'secondary',
        'in-progress': 'info',
        'in-review': 'warning',
        done: 'success'
    };

    const labelMap = {
        todo: 'To Do',
        'in-progress': 'In Progress',
        'in-review': 'In Review',
        done: 'Done'
    };

    return (
        <Badge type={typeMap[status]}>
            {labelMap[status] || status}
        </Badge>
    );
};

export const IssueTypeBadge = ({ type }) => {
    const iconMap = {
        story: '📖',
        task: '✓',
        bug: '🐛',
        epic: '⚡'
    };

    const colorMap = {
        story: 'success',
        task: 'info',
        bug: 'danger',
        epic: 'secondary'
    };

    return (
        <Badge type={colorMap[type]}>
            {iconMap[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
    );
};

export default Badge;
