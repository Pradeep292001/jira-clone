import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, getIssues, getAllUsers, deleteProject } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import Avatar from '../components/Avatar';

const ProjectDetail = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const proj = getProjectById(projectId);
        if (!proj) {
            navigate('/projects');
            return;
        }
        setProject(proj);
        setIssues(getIssues({ projectId }));
        setUsers(getAllUsers());
    }, [projectId]);

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${project.name}? This will delete all issues in this project.`)) {
            deleteProject(projectId);
            navigate('/projects');
        }
    };

    if (!project) return null;

    const stats = {
        total: issues.length,
        todo: issues.filter(i => i.status === 'todo').length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        inReview: issues.filter(i => i.status === 'in-review').length,
        done: issues.filter(i => i.status === 'done').length
    };

    const members = users.filter(u => project.members.includes(u.id));

    return (
        <div className="animate-fadeIn">
            <div className="mb-4">
                <Link to="/projects" style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    ← Back to Projects
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white'
                        }}>
                            {project.key}
                        </div>
                        <div>
                            <h1 style={{ margin: '0 0 0.5rem 0' }}>{project.name}</h1>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-primary">{project.category}</span>
                                <span className="text-muted text-sm">
                                    Created {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleDelete} className="btn btn-danger">
                        Delete Project
                    </button>
                </div>

                <p className="text-secondary">{project.description}</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
                <Link to={`/projects/${projectId}/board`} className="card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0' }}>Board</h3>
                    <p className="text-sm text-muted" style={{ margin: 0 }}>Kanban view</p>
                </Link>

                <Link to={`/projects/${projectId}/backlog`} className="card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0' }}>Backlog</h3>
                    <p className="text-sm text-muted" style={{ margin: 0 }}>Sprint planning</p>
                </Link>

                <div className="card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0' }}>Reports</h3>
                    <p className="text-sm text-muted" style={{ margin: 0 }}>Coming soon</p>
                </div>

                <div className="card">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚙️</div>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0' }}>Settings</h3>
                    <p className="text-sm text-muted" style={{ margin: 0 }}>Coming soon</p>
                </div>
            </div>

            {/* Stats */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>📈 Statistics</h2>
                <div className="grid grid-cols-4">
                    <div>
                        <div className="text-sm text-muted mb-1">Total Issues</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted mb-1">To Do</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                            {stats.todo}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-muted mb-1">In Progress</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-info)' }}>
                            {stats.inProgress}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-muted mb-1">Completed</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>
                            {stats.done}
                        </div>
                    </div>
                </div>

                {stats.total > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <div className="text-sm text-muted mb-2">Completion Progress</div>
                        <div style={{
                            height: '12px',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: '6px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${(stats.done / stats.total) * 100}%`,
                                background: 'var(--gradient-success)',
                                transition: 'width var(--transition-base)'
                            }} />
                        </div>
                        <div className="text-sm text-muted mt-1">
                            {Math.round((stats.done / stats.total) * 100)}% Complete
                        </div>
                    </div>
                )}
            </div>

            {/* Team Members */}
            <div className="card">
                <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>👥 Team Members</h2>
                <div className="flex items-center gap-3">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center gap-2 card" style={{
                            padding: '0.75rem 1rem'
                        }}>
                            <Avatar user={member} size="sm" />
                            <div>
                                <div className="font-semibold text-sm">{member.name}</div>
                                <div className="text-xs text-muted">{member.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
