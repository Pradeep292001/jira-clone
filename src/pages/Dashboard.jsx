import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, getIssues } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import Avatar from '../components/Avatar';
import { getAllUsers } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [issues, setIssues] = useState([]);
    const [myIssues, setMyIssues] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setProjects(getProjects());
        const allIssues = getIssues();
        setIssues(allIssues);
        setMyIssues(allIssues.filter(i => i.assignee === user.id));
        setUsers(getAllUsers());
    }, [user.id]);

    const stats = {
        totalIssues: issues.length,
        inProgress: issues.filter(i => i.status === 'in-progress').length,
        completed: issues.filter(i => i.status === 'done').length,
        myIssues: myIssues.length
    };

    const getUserById = (userId) => users.find(u => u.id === userId);

    return (
        <div className="animate-fadeIn">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.name}! 👋</h1>
                <p className="text-secondary">Here's an overview of your projects and tasks</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    borderColor: 'rgba(99, 102, 241, 0.3)'
                }}>
                    <div className="text-sm text-muted mb-2">Total Issues</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalIssues}</div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
                    borderColor: 'rgba(59, 130, 246, 0.3)'
                }}>
                    <div className="text-sm text-muted mb-2">In Progress</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.inProgress}</div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
                    borderColor: 'rgba(16, 185, 129, 0.3)'
                }}>
                    <div className="text-sm text-muted mb-2">Completed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.completed}</div>
                </div>

                <div className="card" style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
                    borderColor: 'rgba(245, 158, 11, 0.3)'
                }}>
                    <div className="text-sm text-muted mb-2">Assigned to Me</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.myIssues}</div>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                {/* Projects */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>📁 Projects</h2>
                        <Link to="/projects" className="btn btn-sm btn-secondary">
                            View All
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {projects.slice(0, 5).map(project => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="card"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="badge badge-primary">{project.key}</span>
                                            <h3 style={{ margin: 0, fontSize: '1rem' }}>{project.name}</h3>
                                        </div>
                                        <p className="text-sm text-muted" style={{ margin: 0 }}>
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="text-muted">→</div>
                                </div>
                            </Link>
                        ))}

                        {projects.length === 0 && (
                            <div className="card text-center" style={{ padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                <p className="text-muted">No projects yet. Create one to get started!</p>
                                <Link to="/projects" className="btn btn-primary mt-4">
                                    Create Project
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* My Issues */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>✓ Assigned to Me</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {myIssues.slice(0, 5).map(issue => {
                            const assignedUser = getUserById(issue.assignee);
                            return (
                                <Link
                                    key={issue.id}
                                    to={`/issues/${issue.id}`}
                                    className="card"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="badge badge-secondary">{issue.key}</span>
                                        <StatusBadge status={issue.status} />
                                        <PriorityBadge priority={issue.priority} />
                                    </div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9375rem' }}>
                                        {issue.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {assignedUser && <Avatar user={assignedUser} size="sm" />}
                                        <span className="text-sm text-muted">
                                            {assignedUser?.name}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}

                        {myIssues.length === 0 && (
                            <div className="card text-center" style={{ padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                                <p className="text-muted">No issues assigned to you yet!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📊 Recent Activity</h2>
                <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {issues.slice(0, 5).map(issue => {
                            const reporterUser = getUserById(issue.reporter);
                            return (
                                <div key={issue.id} className="flex items-center gap-3" style={{
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    {reporterUser && <Avatar user={reporterUser} size="sm" />}
                                    <div style={{ flex: 1 }}>
                                        <div className="text-sm">
                                            <strong>{reporterUser?.name}</strong> created{' '}
                                            <Link to={`/issues/${issue.id}`} style={{
                                                color: 'var(--color-primary-light)',
                                                textDecoration: 'none'
                                            }}>
                                                {issue.key}
                                            </Link>
                                        </div>
                                        <div className="text-xs text-muted">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <StatusBadge status={issue.status} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
