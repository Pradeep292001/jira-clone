import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    getProjectById,
    getIssues,
    getSprints,
    createSprint,
    startSprint,
    completeSprint,
    updateIssue
} from '../services/api';
import IssueCard from '../components/IssueCard';
import CreateIssueModal from '../components/CreateIssueModal';

const Backlog = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSprintModal, setShowSprintModal] = useState(false);
    const [newSprintName, setNewSprintName] = useState('');

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = () => {
        const proj = getProjectById(projectId);
        if (!proj) {
            navigate('/projects');
            return;
        }
        setProject(proj);
        setIssues(getIssues({ projectId }));
        setSprints(getSprints(projectId));
    };

    const handleCreateSprint = (e) => {
        e.preventDefault();
        createSprint(projectId, { name: newSprintName });
        setNewSprintName('');
        setShowSprintModal(false);
        loadData();
    };

    const handleStartSprint = (sprintId) => {
        startSprint(sprintId);
        loadData();
    };

    const handleCompleteSprint = (sprintId) => {
        completeSprint(sprintId);
        loadData();
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const sprintId = destination.droppableId === 'backlog' ? null : destination.droppableId;

        updateIssue(draggableId, { sprintId });
        loadData();
    };

    const getSprintIssues = (sprintId) => {
        return issues.filter(i => i.sprintId === sprintId);
    };

    const backlogIssues = issues.filter(i => !i.sprintId);
    const activeSprint = sprints.find(s => s.status === 'active');
    const plannedSprints = sprints.filter(s => s.status === 'planned');

    if (!project) return null;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1>📝 Backlog - {project.name}</h1>
                    <p className="text-secondary">Plan and manage sprints</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-secondary">
                        + Create Issue
                    </button>
                    <button onClick={() => setShowSprintModal(true)} className="btn btn-primary">
                        + Create Sprint
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Active Sprint */}
                {activeSprint && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 style={{ fontSize: '1.125rem', margin: '0 0 0.25rem 0' }}>
                                    🏃 {activeSprint.name}
                                </h2>
                                <span className="badge badge-success">Active Sprint</span>
                            </div>
                            <button
                                onClick={() => handleCompleteSprint(activeSprint.id)}
                                className="btn btn-secondary btn-sm"
                            >
                                Complete Sprint
                            </button>
                        </div>

                        <Droppable droppableId={activeSprint.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {getSprintIssues(activeSprint.id).map((issue, index) => (
                                        <Draggable key={issue.id} draggableId={issue.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <IssueCard
                                                        issue={issue}
                                                        onClick={() => navigate(`/issues/${issue.id}`)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {getSprintIssues(activeSprint.id).length === 0 && (
                                        <div className="text-center text-muted" style={{ padding: '2rem' }}>
                                            No issues in this sprint. Drag issues from the backlog.
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                )}

                {/* Planned Sprints */}
                {plannedSprints.map(sprint => (
                    <div key={sprint.id} className="card" style={{ marginBottom: '1.5rem' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 style={{ fontSize: '1.125rem', margin: '0 0 0.25rem 0' }}>
                                    📅 {sprint.name}
                                </h2>
                                <span className="badge badge-info">Planned</span>
                            </div>
                            <button
                                onClick={() => handleStartSprint(sprint.id)}
                                className="btn btn-primary btn-sm"
                                disabled={!!activeSprint}
                            >
                                Start Sprint
                            </button>
                        </div>

                        <Droppable droppableId={sprint.id}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {getSprintIssues(sprint.id).map((issue, index) => (
                                        <Draggable key={issue.id} draggableId={issue.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <IssueCard
                                                        issue={issue}
                                                        onClick={() => navigate(`/issues/${issue.id}`)}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {getSprintIssues(sprint.id).length === 0 && (
                                        <div className="text-center text-muted" style={{ padding: '2rem' }}>
                                            No issues in this sprint. Drag issues from the backlog.
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}

                {/* Backlog */}
                <div className="card">
                    <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
                        📦 Backlog ({backlogIssues.length})
                    </h2>

                    <Droppable droppableId="backlog">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {backlogIssues.map((issue, index) => (
                                    <Draggable key={issue.id} draggableId={issue.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <IssueCard
                                                    issue={issue}
                                                    onClick={() => navigate(`/issues/${issue.id}`)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                {backlogIssues.length === 0 && (
                                    <div className="text-center text-muted" style={{ padding: '2rem' }}>
                                        No issues in backlog. Create some issues to get started!
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>

            {/* Create Sprint Modal */}
            {showSprintModal && (
                <div className="modal-overlay" onClick={() => setShowSprintModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Create Sprint</h2>
                            <button className="modal-close" onClick={() => setShowSprintModal(false)}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateSprint}>
                            <div className="modal-body">
                                <div className="input-group">
                                    <label htmlFor="sprintName" className="input-label">Sprint Name</label>
                                    <input
                                        type="text"
                                        id="sprintName"
                                        className="input"
                                        placeholder="Sprint 1"
                                        value={newSprintName}
                                        onChange={(e) => setNewSprintName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowSprintModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Sprint
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <CreateIssueModal
                    projectId={projectId}
                    onClose={() => setShowCreateModal(false)}
                    onIssueCreated={loadData}
                />
            )}
        </div>
    );
};

export default Backlog;
