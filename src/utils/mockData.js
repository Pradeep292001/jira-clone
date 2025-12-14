// Mock data for demo purposes
export const mockUsers = [
    {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'admin',
        avatar: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password',
        role: 'developer',
        avatar: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 'user-3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password',
        role: 'developer',
        avatar: null,
        createdAt: new Date().toISOString()
    }
];

export const mockProjects = [
    {
        id: 'project-1',
        key: 'DEMO',
        name: 'Demo Project',
        description: 'A sample project to showcase Jira clone features',
        category: 'software',
        owner: 'user-1',
        members: ['user-1', 'user-2', 'user-3'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const mockIssues = [
    {
        id: 'issue-1',
        key: 'DEMO-1',
        projectId: 'project-1',
        title: 'Setup development environment',
        description: 'Install all necessary dependencies and configure the development environment',
        type: 'task',
        status: 'done',
        priority: 'high',
        assignee: 'user-1',
        reporter: 'user-1',
        sprintId: null,
        storyPoints: 3,
        labels: ['setup', 'devops'],
        attachments: [],
        activities: [
            {
                id: 'activity-1',
                type: 'created',
                userId: 'user-1',
                description: 'created this issue',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'activity-2',
                type: 'status_changed',
                userId: 'user-1',
                description: 'changed status from todo to done',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'issue-2',
        key: 'DEMO-2',
        projectId: 'project-1',
        title: 'Design user interface mockups',
        description: 'Create high-fidelity mockups for the main application screens',
        type: 'story',
        status: 'in-progress',
        priority: 'high',
        assignee: 'user-2',
        reporter: 'user-1',
        sprintId: null,
        storyPoints: 5,
        labels: ['design', 'ui'],
        attachments: [],
        activities: [
            {
                id: 'activity-3',
                type: 'created',
                userId: 'user-1',
                description: 'created this issue',
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'activity-4',
                type: 'assigned',
                userId: 'user-1',
                description: 'assigned to user-2',
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'activity-5',
                type: 'status_changed',
                userId: 'user-2',
                description: 'changed status from todo to in-progress',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ],
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'issue-3',
        key: 'DEMO-3',
        projectId: 'project-1',
        title: 'Implement authentication system',
        description: 'Build login and registration functionality with JWT tokens',
        type: 'story',
        status: 'in-review',
        priority: 'high',
        assignee: 'user-3',
        reporter: 'user-1',
        sprintId: null,
        storyPoints: 8,
        labels: ['backend', 'security'],
        attachments: [],
        activities: [],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'issue-4',
        key: 'DEMO-4',
        projectId: 'project-1',
        title: 'Fix responsive layout on mobile',
        description: 'The navigation menu is breaking on small screens',
        type: 'bug',
        status: 'todo',
        priority: 'medium',
        assignee: 'user-2',
        reporter: 'user-3',
        sprintId: null,
        storyPoints: 2,
        labels: ['frontend', 'bug'],
        attachments: [],
        activities: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'issue-5',
        key: 'DEMO-5',
        projectId: 'project-1',
        title: 'Add dark mode support',
        description: 'Implement theme switching between light and dark modes',
        type: 'story',
        status: 'todo',
        priority: 'low',
        assignee: null,
        reporter: 'user-2',
        sprintId: null,
        storyPoints: 5,
        labels: ['frontend', 'enhancement'],
        attachments: [],
        activities: [],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const mockComments = [
    {
        id: 'comment-1',
        issueId: 'issue-2',
        userId: 'user-1',
        text: 'Great progress on the mockups! Can you also include the mobile views?',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'comment-2',
        issueId: 'issue-2',
        userId: 'user-2',
        text: 'Sure! I\'ll add the mobile views by end of day.',
        createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const mockSprints = [
    {
        id: 'sprint-1',
        projectId: 'project-1',
        name: 'Sprint 1',
        goal: 'Complete basic setup and design',
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'user-1'
    }
];

// Initialize function
export const initializeMockData = () => {
    const existingUsers = localStorage.getItem('jira_users');

    if (!existingUsers) {
        localStorage.setItem('jira_users', JSON.stringify(mockUsers));
        localStorage.setItem('jira_projects', JSON.stringify(mockProjects));
        localStorage.setItem('jira_issues', JSON.stringify(mockIssues));
        localStorage.setItem('jira_comments', JSON.stringify(mockComments));
        localStorage.setItem('jira_sprints', JSON.stringify(mockSprints));
        console.log('Mock data initialized!');
    }
};
