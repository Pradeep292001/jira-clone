import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
    const { projectId } = useParams();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar projectId={projectId} />
                <main style={{
                    flex: 1,
                    padding: '2rem',
                    overflow: 'auto',
                    background: 'var(--color-bg-primary)'
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
