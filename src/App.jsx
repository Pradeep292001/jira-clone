import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Board from './pages/Board';
import Backlog from './pages/Backlog';
import IssueDetail from './pages/IssueDetail';

// Layout
import AppLayout from './components/AppLayout';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Register />
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:projectId" element={<ProjectDetail />} />
                <Route path="projects/:projectId/board" element={<Board />} />
                <Route path="projects/:projectId/backlog" element={<Backlog />} />
                <Route path="issues/:issueId" element={<IssueDetail />} />
            </Route>
        </Routes>
    );
};

export default App;
