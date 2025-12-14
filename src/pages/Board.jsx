import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getProjectById, getIssues, updateIssue } from '../services/api';
import IssueCard from '../components/IssueCard';
import CreateIssueModal from '../components/CreateIssueModal';

const Board = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const columns = [
        { id: 'todo', title: 'To Do', color: '#94a3b8' },
        { id: 'in-progress', title: 'In Progress', color: '#3b82f6' },
        { id: 'in-review', title: 'In Review', color: '#f59e0b' },
        { id: 'done', title: 'Done', color: '#10b981' }
    ];

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
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        // Update issue status
        updateIssue(draggableId, { status: destination.droppableId });
        loadData();
    };

    const getIssuesByStatus = (status) => {
        return issues.filter(issue => issue.status === status);
    };

    if (!project) return null;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 style={{ margin: 0 }}>📋 {project.name}</h1>
                        <span className="badge badge-primary">{project.key}</span>
                    </div>
                    <p className="text-secondary">Kanban Board</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                    + Create Issue
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem',
                    alignItems: 'flex-start'
                }}>
                    {columns.map(column => {
                        const columnIssues = getIssuesByStatus(column.id);

                        return (
                            <div key={column.id}>
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    background: 'var(--color-surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    marginBottom: '1rem',
                                    borderLeft: `3px solid ${column.color}`
                                }}>
                                    <div className="flex items-center justify-between">
                                        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
                                            {column.title}
                                        </h3>
                                        <span className="badge badge-secondary">{columnIssues.length}</span>
                                    </div>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                minHeight: '500px',
                                                padding: '0.5rem',
                                                background: snapshot.isDraggingOver
                                                    ? 'rgba(99, 102, 241, 0.1)'
                                                    : 'transparent',
                                                borderRadius: 'var(--radius-lg)',
                                                transition: 'background var(--transition-fast)'
                                            }}
                                        >
                                            {columnIssues.map((issue, index) => (
                                                <Draggable key={issue.id} draggableId={issue.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                                transform: snapshot.isDragging
                                                                    ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                                                    : provided.draggableProps.style?.transform
                                                            }}
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

                                            {columnIssues.length === 0 && (
                                                <div style={{
                                                    padding: '2rem 1rem',
                                                    textAlign: 'center',
                                                    color: 'var(--color-text-muted)',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    No issues
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

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

export default Board;
