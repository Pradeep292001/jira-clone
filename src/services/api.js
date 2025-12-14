// LocalStorage API Service
const STORAGE_KEYS = {
    USERS: 'jira_users',
    PROJECTS: 'jira_projects',
    ISSUES: 'jira_issues',
    COMMENTS: 'jira_comments',
    SPRINTS: 'jira_sprints',
    CURRENT_USER: 'jira_current_user'
};

// Helper functions
const getItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
};

const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting ${key}:`, error);
        return false;
    }
};

const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// API Functions

// Auth
export const login = (email, password) => {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password, ...userWithoutPassword } = user;
        setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
        return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid credentials' };
};

export const register = (userData) => {
    const users = getItem(STORAGE_KEYS.USERS) || [];

    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already exists' };
    }

    const newUser = {
        id: generateId(),
        ...userData,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);

    const { password, ...userWithoutPassword } = newUser;
    setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);

    return { success: true, user: userWithoutPassword };
};

export const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
};

export const getCurrentUser = () => {
    return getItem(STORAGE_KEYS.CURRENT_USER);
};

export const getAllUsers = () => {
    const users = getItem(STORAGE_KEYS.USERS) || [];
    return users.map(({ password, ...user }) => user);
};

// Projects
export const getProjects = () => {
    return getItem(STORAGE_KEYS.PROJECTS) || [];
};

export const getProjectById = (id) => {
    const projects = getProjects();
    return projects.find(p => p.id === id);
};

export const createProject = (projectData) => {
    const projects = getProjects();
    const currentUser = getCurrentUser();

    const newProject = {
        id: generateId(),
        key: projectData.key.toUpperCase(),
        name: projectData.name,
        description: projectData.description,
        category: projectData.category,
        owner: currentUser.id,
        members: [currentUser.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    setItem(STORAGE_KEYS.PROJECTS, projects);

    return { success: true, project: newProject };
};

export const updateProject = (id, updates) => {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
        return { success: false, error: 'Project not found' };
    }

    projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    setItem(STORAGE_KEYS.PROJECTS, projects);
    return { success: true, project: projects[index] };
};

export const deleteProject = (id) => {
    const projects = getProjects();
    const filtered = projects.filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PROJECTS, filtered);

    // Also delete related issues
    const issues = getIssues();
    const filteredIssues = issues.filter(i => i.projectId !== id);
    setItem(STORAGE_KEYS.ISSUES, filteredIssues);

    return { success: true };
};

// Issues
export const getIssues = (filters = {}) => {
    let issues = getItem(STORAGE_KEYS.ISSUES) || [];

    if (filters.projectId) {
        issues = issues.filter(i => i.projectId === filters.projectId);
    }

    if (filters.status) {
        issues = issues.filter(i => i.status === filters.status);
    }

    if (filters.assignee) {
        issues = issues.filter(i => i.assignee === filters.assignee);
    }

    if (filters.type) {
        issues = issues.filter(i => i.type === filters.type);
    }

    if (filters.sprint) {
        issues = issues.filter(i => i.sprintId === filters.sprint);
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        issues = issues.filter(i =>
            i.title.toLowerCase().includes(searchLower) ||
            i.description.toLowerCase().includes(searchLower) ||
            i.key.toLowerCase().includes(searchLower)
        );
    }

    return issues;
};

export const getIssueById = (id) => {
    const issues = getIssues();
    return issues.find(i => i.id === id);
};

export const createIssue = (issueData) => {
    const issues = getIssues();
    const currentUser = getCurrentUser();
    const project = getProjectById(issueData.projectId);

    if (!project) {
        return { success: false, error: 'Project not found' };
    }

    // Generate issue key (e.g., PROJ-123)
    const projectIssues = issues.filter(i => i.projectId === issueData.projectId);
    const issueNumber = projectIssues.length + 1;
    const issueKey = `${project.key}-${issueNumber}`;

    const newIssue = {
        id: generateId(),
        key: issueKey,
        projectId: issueData.projectId,
        title: issueData.title,
        description: issueData.description || '',
        type: issueData.type || 'task',
        status: issueData.status || 'todo',
        priority: issueData.priority || 'medium',
        assignee: issueData.assignee || null,
        reporter: currentUser.id,
        sprintId: issueData.sprintId || null,
        storyPoints: issueData.storyPoints || null,
        labels: issueData.labels || [],
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    issues.push(newIssue);
    setItem(STORAGE_KEYS.ISSUES, issues);

    // Add activity
    addActivity(newIssue.id, {
        type: 'created',
        userId: currentUser.id,
        description: 'created this issue'
    });

    return { success: true, issue: newIssue };
};

export const updateIssue = (id, updates) => {
    const issues = getIssues();
    const index = issues.findIndex(i => i.id === id);

    if (index === -1) {
        return { success: false, error: 'Issue not found' };
    }

    const currentUser = getCurrentUser();
    const oldIssue = issues[index];

    issues[index] = {
        ...oldIssue,
        ...updates,
        updatedAt: new Date().toISOString()
    };

    setItem(STORAGE_KEYS.ISSUES, issues);

    // Log activity for significant changes
    if (updates.status && updates.status !== oldIssue.status) {
        addActivity(id, {
            type: 'status_changed',
            userId: currentUser.id,
            description: `changed status from ${oldIssue.status} to ${updates.status}`
        });
    }

    if (updates.assignee && updates.assignee !== oldIssue.assignee) {
        addActivity(id, {
            type: 'assigned',
            userId: currentUser.id,
            description: `assigned to ${updates.assignee}`
        });
    }

    return { success: true, issue: issues[index] };
};

export const deleteIssue = (id) => {
    const issues = getIssues();
    const filtered = issues.filter(i => i.id !== id);
    setItem(STORAGE_KEYS.ISSUES, filtered);

    // Delete related comments
    const comments = getComments(id);
    const allComments = getItem(STORAGE_KEYS.COMMENTS) || [];
    const filteredComments = allComments.filter(c => c.issueId !== id);
    setItem(STORAGE_KEYS.COMMENTS, filteredComments);

    return { success: true };
};

// Comments
export const getComments = (issueId) => {
    const allComments = getItem(STORAGE_KEYS.COMMENTS) || [];
    return allComments.filter(c => c.issueId === issueId);
};

export const addComment = (issueId, text) => {
    const comments = getItem(STORAGE_KEYS.COMMENTS) || [];
    const currentUser = getCurrentUser();

    const newComment = {
        id: generateId(),
        issueId,
        userId: currentUser.id,
        text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    comments.push(newComment);
    setItem(STORAGE_KEYS.COMMENTS, comments);

    return { success: true, comment: newComment };
};

export const updateComment = (id, text) => {
    const comments = getItem(STORAGE_KEYS.COMMENTS) || [];
    const index = comments.findIndex(c => c.id === id);

    if (index === -1) {
        return { success: false, error: 'Comment not found' };
    }

    comments[index] = {
        ...comments[index],
        text,
        updatedAt: new Date().toISOString()
    };

    setItem(STORAGE_KEYS.COMMENTS, comments);
    return { success: true, comment: comments[index] };
};

export const deleteComment = (id) => {
    const comments = getItem(STORAGE_KEYS.COMMENTS) || [];
    const filtered = comments.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.COMMENTS, filtered);
    return { success: true };
};

// Sprints
export const getSprints = (projectId) => {
    const allSprints = getItem(STORAGE_KEYS.SPRINTS) || [];
    return allSprints.filter(s => s.projectId === projectId);
};

export const createSprint = (projectId, sprintData) => {
    const sprints = getItem(STORAGE_KEYS.SPRINTS) || [];
    const currentUser = getCurrentUser();

    const newSprint = {
        id: generateId(),
        projectId,
        name: sprintData.name,
        goal: sprintData.goal || '',
        startDate: sprintData.startDate || null,
        endDate: sprintData.endDate || null,
        status: 'planned',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id
    };

    sprints.push(newSprint);
    setItem(STORAGE_KEYS.SPRINTS, sprints);

    return { success: true, sprint: newSprint };
};

export const updateSprint = (id, updates) => {
    const sprints = getItem(STORAGE_KEYS.SPRINTS) || [];
    const index = sprints.findIndex(s => s.id === id);

    if (index === -1) {
        return { success: false, error: 'Sprint not found' };
    }

    sprints[index] = { ...sprints[index], ...updates };
    setItem(STORAGE_KEYS.SPRINTS, sprints);

    return { success: true, sprint: sprints[index] };
};

export const startSprint = (id) => {
    return updateSprint(id, {
        status: 'active',
        startDate: new Date().toISOString()
    });
};

export const completeSprint = (id) => {
    return updateSprint(id, {
        status: 'completed',
        endDate: new Date().toISOString()
    });
};

// Activity Log (stored with issues)
const addActivity = (issueId, activity) => {
    const issues = getIssues();
    const issue = issues.find(i => i.id === issueId);

    if (issue) {
        if (!issue.activities) {
            issue.activities = [];
        }

        issue.activities.push({
            id: generateId(),
            ...activity,
            timestamp: new Date().toISOString()
        });

        setItem(STORAGE_KEYS.ISSUES, issues);
    }
};

export const getActivities = (issueId) => {
    const issue = getIssueById(issueId);
    return issue?.activities || [];
};
