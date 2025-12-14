import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject, getIssues } from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        key: '',
        description: '',
        category: 'software'
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const projectsData = await getProjects();
        setProjects(projectsData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await createProject(formData);
        if (result.success) {
            setShowCreateModal(false);
            setFormData({ name: '', key: '', description: '', category: 'software' });
            loadProjects();
        }
    };

    const getProjectStats = async (projectId) => {
        const issues = await getIssues({ projectId });
        return {
            total: issues.length,
            done: issues.filter(i => i.status === 'done').length
        };
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1>📁 Projects</h1>
                    <p className="text-secondary">Manage and organize your projects</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                >
                    + New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📂</div>
                    <h3 style={{ marginBottom: '1rem' }}>No projects yet</h3>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>
                        Create your first project to start managing tasks and issues
                    </p>
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-lg">
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {projects.map(project => {
                        const stats = getProjectStats(project.id);
                        return (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="card"
                                style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '100px',
                                    height: '100px',
                                    background: 'var(--gradient-primary)',
                                    opacity: 0.1,
                                    borderRadius: '0 0 0 100%'
                                }} />

                                <div className="flex items-center gap-3 mb-3">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        color: 'white'
                                    }}>
                                        {project.key}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem' }}>
                                            {project.name}
                                        </h3>
                                        <span className="badge badge-primary">{project.category}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted mb-3" style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {project.description}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--color-border)'
                                }}>
                                    <div>
                                        <div className="text-xs text-muted">Issues</div>
                                        <div className="font-semibold">{stats.total}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted">Completed</div>
                                        <div className="font-semibold text-success">{stats.done}</div>
                                    </div>
                                    {stats.total > 0 && (
                                        <div style={{ flex: 1 }}>
                                            <div className="text-xs text-muted">Progress</div>
                                            <div style={{
                                                height: '8px',
                                                background: 'var(--color-bg-tertiary)',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                marginTop: '0.25rem'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${(stats.done / stats.total) * 100}%`,
                                                    background: 'var(--gradient-success)',
                                                    transition: 'width var(--transition-base)'
                                                }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Create New Project</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label htmlFor="name" className="input-label">Project Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="input"
                                        placeholder="My Awesome Project"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="key" className="input-label">Project Key</label>
                                    <input
                                        type="text"
                                        id="key"
                                        className="input"
                                        placeholder="MAP"
                                        value={formData.key}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            key: e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10)
                                        })}
                                        maxLength={10}
                                        required
                                    />
                                    <p className="text-xs text-muted mt-1">
                                        Short identifier for issues (e.g., MAP-123)
                                    </p>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="category" className="input-label">Category</label>
                                    <select
                                        id="category"
                                        className="input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="software">Software</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="business">Business</option>
                                        <option value="design">Design</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="description" className="input-label">Description</label>
                                    <textarea
                                        id="description"
                                        className="input"
                                        placeholder="Describe your project..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
