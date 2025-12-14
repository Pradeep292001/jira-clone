import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    getIssueById,
    updateIssue,
    deleteIssue,
    getComments,
    addComment,
    getAllUsers,
    getProjectById
} from '../services/api';
import { PriorityBadge, StatusBadge, IssueTypeBadge } from '../components/Badge';
import Avatar from '../components/Avatar';

const IssueDetail = () => {
    const { issueId } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const users = getAllUsers();

    useEffect(() => {
        loadIssue();
    }, [issueId]);

    const loadIssue = () => {
        const iss = getIssueById(issueId);
        if (!iss) {
            navigate('/');
            return;
        }
        setIssue(iss);
        setEditData(iss);
        setProject(getProjectById(iss.projectId));
        setComments(getComments(issueId));
    };

    const handleUpdate = (updates) => {
        updateIssue(issueId, updates);
        loadIssue();
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this issue?')) {
            deleteIssue(issueId);
            navigate(`/projects/${issue.projectId}/board`);
        }
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(issueId, newComment);
            setNewComment('');
            loadIssue();
        }
    };

    const handleSaveEdit = () => {
        handleUpdate(editData);
        setIsEditing(false);
    };

    const getUserById = (userId) => users.find(u => u.id === userId);

    if (!issue) return null;

    const reporter = getUserById(issue.reporter);
    const assignee = getUserById(issue.assignee);

    return (
        <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="mb-4">
                <Link to={`/projects/${issue.projectId}/board`} style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    ← Back to Board
                </Link>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '2rem', alignItems: 'flex-start' }}>
                {/* Main Content */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="badge badge-secondary">{issue.key}</span>
                            <IssueTypeBadge type={issue.type} />
                            {project && <span className="text-muted">in {project.name}</span>}
                        </div>

                        {isEditing ? (
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                    style={{ fontSize: '1.5rem', fontWeight: 700 }}
                                />
                            </div>
                        ) : (
                            <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{issue.title}</h1>
                        )}

                        <div style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                                Description
                            </h3>
                            {isEditing ? (
                                <textarea
                                    className="input"
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    rows={6}
                                />
                            ) : (
                                <p className="text-secondary" style={{ whiteSpace: 'pre-wrap' }}>
                                    {issue.description || 'No description provided.'}
                                </p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-2 mt-4">
                                <button onClick={handleSaveEdit} className="btn btn-primary btn-sm">
                                    Save
                                </button>
                                <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comments */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>💬 Comments</h3>

                        <form onSubmit={handleAddComment} className="mb-4">
                            <textarea
                                className="input"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary btn-sm mt-2"
                                disabled={!newComment.trim()}
                            >
                                Add Comment
                            </button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {comments.map(comment => {
                                const commenter = getUserById(comment.userId);
                                return (
                                    <div key={comment.id} style={{
                                        padding: '1rem',
                                        background: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)'
                                    }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {commenter && <Avatar user={commenter} size="sm" />}
                                            <div>
                                                <div className="font-semibold text-sm">{commenter?.name}</div>
                                                <div className="text-xs text-muted">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{comment.text}</p>
                                    </div>
                                );
                            })}

                            {comments.length === 0 && (
                                <p className="text-center text-muted" style={{ padding: '2rem' }}>
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '80px' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>
                            Details
                        </h3>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-secondary btn-sm mb-3"
                                style={{ width: '100%' }}
                            >
                                ✏️ Edit
                            </button>
                        )}

                        <div className="input-group">
                            <label className="input-label">Status</label>
                            <select
                                className="input"
                                value={issue.status}
                                onChange={(e) => handleUpdate({ status: e.target.value })}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="in-review">In Review</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Priority</label>
                            <select
                                className="input"
                                value={issue.priority}
                                onChange={(e) => handleUpdate({ priority: e.target.value })}
                            >
                                <option value="highest">Highest</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                                <option value="lowest">Lowest</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Assignee</label>
                            <select
                                className="input"
                                value={issue.assignee || ''}
                                onChange={(e) => handleUpdate({ assignee: e.target.value || null })}
                            >
                                <option value="">Unassigned</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Reporter</label>
                            <div className="flex items-center gap-2">
                                {reporter && <Avatar user={reporter} size="sm" />}
                                <span>{reporter?.name}</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Story Points</label>
                            <input
                                type="number"
                                className="input"
                                value={issue.storyPoints || ''}
                                onChange={(e) => handleUpdate({
                                    storyPoints: e.target.value ? parseInt(e.target.value) : null
                                })}
                                min="1"
                                max="100"
                            />
                        </div>

                        <div style={{
                            marginTop: '1.5rem',
                            paddingTop: '1.5rem',
                            borderTop: '1px solid var(--color-border)'
                        }}>
                            <div className="text-xs text-muted mb-1">Created</div>
                            <div className="text-sm mb-3">
                                {new Date(issue.createdAt).toLocaleString()}
                            </div>

                            <div className="text-xs text-muted mb-1">Updated</div>
                            <div className="text-sm">
                                {new Date(issue.updatedAt).toLocaleString()}
                            </div>
                        </div>

                        <button
                            onClick={handleDelete}
                            className="btn btn-danger btn-sm mt-4"
                            style={{ width: '100%' }}
                        >
                            🗑️ Delete Issue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetail;
