import React, { useState } from 'react';
import { createIssue, getAllUsers } from '../services/api';

const CreateIssueModal = ({ projectId, onClose, onIssueCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'task',
        priority: 'medium',
        assignee: '',
        storyPoints: ''
    });

    const users = getAllUsers();

    const handleSubmit = (e) => {
        e.preventDefault();

        const issueData = {
            ...formData,
            projectId,
            storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : null,
            assignee: formData.assignee || null
        };

        const result = createIssue(issueData);

        if (result.success) {
            onIssueCreated(result.issue);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Create Issue</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="input-group">
                            <label htmlFor="type" className="input-label">Issue Type</label>
                            <select
                                id="type"
                                className="input"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="story">📖 Story</option>
                                <option value="task">✓ Task</option>
                                <option value="bug">🐛 Bug</option>
                                <option value="epic">⚡ Epic</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="title" className="input-label">Title</label>
                            <input
                                type="text"
                                id="title"
                                className="input"
                                placeholder="What needs to be done?"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="description" className="input-label">Description</label>
                            <textarea
                                id="description"
                                className="input"
                                placeholder="Add more details..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2">
                            <div className="input-group">
                                <label htmlFor="priority" className="input-label">Priority</label>
                                <select
                                    id="priority"
                                    className="input"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="highest">🔥 Highest</option>
                                    <option value="high">⬆️ High</option>
                                    <option value="medium">➡️ Medium</option>
                                    <option value="low">⬇️ Low</option>
                                    <option value="lowest">📋 Lowest</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor="assignee" className="input-label">Assignee</label>
                                <select
                                    id="assignee"
                                    className="input"
                                    value={formData.assignee}
                                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="storyPoints" className="input-label">Story Points (optional)</label>
                            <input
                                type="number"
                                id="storyPoints"
                                className="input"
                                placeholder="e.g., 3, 5, 8"
                                value={formData.storyPoints}
                                onChange={(e) => setFormData({ ...formData, storyPoints: e.target.value })}
                                min="1"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIssueModal;
