import React from 'react';
import { PriorityBadge, IssueTypeBadge } from './Badge';
import Avatar from './Avatar';
import { getAllUsers } from '../services/api';

const IssueCard = ({ issue, onClick }) => {
    const users = getAllUsers();
    const assignee = users.find(u => u.id === issue.assignee);

    return (
        <div
            onClick={onClick}
            className="card"
            style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
            }}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-secondary text-xs">{issue.key}</span>
                <IssueTypeBadge type={issue.type} />
            </div>

            <h4 style={{
                fontSize: '0.875rem',
                margin: '0 0 0.5rem 0',
                lineHeight: 1.4
            }}>
                {issue.title}
            </h4>

            <div className="flex items-center justify-between">
                <PriorityBadge priority={issue.priority} />
                {assignee && (
                    <Avatar user={assignee} size="sm" />
                )}
            </div>
        </div>
    );
};

export default IssueCard;
