// Firestore API Service - Real-time Multi-Device Collaboration
// This replaces the localStorage implementation with Firebase Firestore

import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from './firebase';

// Helper to generate IDs
const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ==================== AUTHENTICATION ====================

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            return {
                success: true,
                user: { id: user.uid, ...userDoc.data() }
            };
        }

        return { success: false, error: 'User data not found' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
};

export const register = async (userData) => {
    try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );
        const user = userCredential.user;

        // Store user data in Firestore
        const userDataToStore = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar || null,
            createdAt: serverTimestamp()
        };

        await setDoc(doc(db, 'users', user.uid), userDataToStore);

        return {
            success: true,
            user: { id: user.uid, ...userDataToStore }
        };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: error.message };
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getCurrentUser = () => {
    return auth.currentUser ? {
        id: auth.currentUser.uid,
        email: auth.currentUser.email
    } : null;
};

export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                callback({ id: user.uid, ...userDoc.data() });
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};

export const getAllUsers = async () => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        return usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

// ==================== PROJECTS ====================

export const getProjects = async () => {
    try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        return projectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

export const getProjectById = async (id) => {
    try {
        const projectDoc = await getDoc(doc(db, 'projects', id));
        if (projectDoc.exists()) {
            return { id: projectDoc.id, ...projectDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
};

export const createProject = async (projectData) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        const newProject = {
            key: projectData.key.toUpperCase(),
            name: projectData.name,
            description: projectData.description,
            category: projectData.category,
            owner: currentUser.uid,
            members: [currentUser.uid],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'projects'), newProject);

        return {
            success: true,
            project: { id: docRef.id, ...newProject }
        };
    } catch (error) {
        console.error('Error creating project:', error);
        return { success: false, error: error.message };
    }
};

export const updateProject = async (id, updates) => {
    try {
        await updateDoc(doc(db, 'projects', id), {
            ...updates,
            updatedAt: serverTimestamp()
        });

        const updatedProject = await getProjectById(id);
        return { success: true, project: updatedProject };
    } catch (error) {
        console.error('Error updating project:', error);
        return { success: false, error: error.message };
    }
};

export const deleteProject = async (id) => {
    try {
        // Delete project
        await deleteDoc(doc(db, 'projects', id));

        // Delete related issues
        const issuesQuery = query(collection(db, 'issues'), where('projectId', '==', id));
        const issuesSnapshot = await getDocs(issuesQuery);
        const deletePromises = issuesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return { success: true };
    } catch (error) {
        console.error('Error deleting project:', error);
        return { success: false, error: error.message };
    }
};

// ==================== ISSUES ====================

export const getIssues = async (filters = {}) => {
    try {
        let issuesQuery = collection(db, 'issues');

        // Apply filters
        const constraints = [];
        if (filters.projectId) {
            constraints.push(where('projectId', '==', filters.projectId));
        }
        if (filters.status) {
            constraints.push(where('status', '==', filters.status));
        }
        if (filters.assignee) {
            constraints.push(where('assignee', '==', filters.assignee));
        }
        if (filters.type) {
            constraints.push(where('type', '==', filters.type));
        }
        if (filters.sprint) {
            constraints.push(where('sprintId', '==', filters.sprint));
        }

        if (constraints.length > 0) {
            issuesQuery = query(issuesQuery, ...constraints);
        }

        const snapshot = await getDocs(issuesQuery);
        let issues = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side search filtering
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            issues = issues.filter(i =>
                i.title?.toLowerCase().includes(searchLower) ||
                i.description?.toLowerCase().includes(searchLower) ||
                i.key?.toLowerCase().includes(searchLower)
            );
        }

        return issues;
    } catch (error) {
        console.error('Error fetching issues:', error);
        return [];
    }
};

export const getIssueById = async (id) => {
    try {
        const issueDoc = await getDoc(doc(db, 'issues', id));
        if (issueDoc.exists()) {
            return { id: issueDoc.id, ...issueDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching issue:', error);
        return null;
    }
};

export const createIssue = async (issueData) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        const project = await getProjectById(issueData.projectId);
        if (!project) {
            return { success: false, error: 'Project not found' };
        }

        // Generate issue key
        const projectIssues = await getIssues({ projectId: issueData.projectId });
        const issueNumber = projectIssues.length + 1;
        const issueKey = `${project.key}-${issueNumber}`;

        const newIssue = {
            key: issueKey,
            projectId: issueData.projectId,
            title: issueData.title,
            description: issueData.description || '',
            type: issueData.type || 'task',
            status: issueData.status || 'todo',
            priority: issueData.priority || 'medium',
            assignee: issueData.assignee || null,
            reporter: currentUser.uid,
            sprintId: issueData.sprintId || null,
            storyPoints: issueData.storyPoints || null,
            labels: issueData.labels || [],
            attachments: [],
            activities: [{
                id: generateId(),
                type: 'created',
                userId: currentUser.uid,
                description: 'created this issue',
                timestamp: new Date().toISOString()
            }],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'issues'), newIssue);

        return {
            success: true,
            issue: { id: docRef.id, ...newIssue }
        };
    } catch (error) {
        console.error('Error creating issue:', error);
        return { success: false, error: error.message };
    }
};

export const updateIssue = async (id, updates) => {
    try {
        const currentUser = auth.currentUser;
        const oldIssue = await getIssueById(id);

        // Track activities
        const activities = oldIssue.activities || [];

        if (updates.status && updates.status !== oldIssue.status) {
            activities.push({
                id: generateId(),
                type: 'status_changed',
                userId: currentUser.uid,
                description: `changed status from ${oldIssue.status} to ${updates.status}`,
                timestamp: new Date().toISOString()
            });
        }

        if (updates.assignee && updates.assignee !== oldIssue.assignee) {
            activities.push({
                id: generateId(),
                type: 'assigned',
                userId: currentUser.uid,
                description: `assigned to ${updates.assignee}`,
                timestamp: new Date().toISOString()
            });
        }

        await updateDoc(doc(db, 'issues', id), {
            ...updates,
            activities,
            updatedAt: serverTimestamp()
        });

        const updatedIssue = await getIssueById(id);
        return { success: true, issue: updatedIssue };
    } catch (error) {
        console.error('Error updating issue:', error);
        return { success: false, error: error.message };
    }
};

export const deleteIssue = async (id) => {
    try {
        await deleteDoc(doc(db, 'issues', id));

        // Delete related comments
        const commentsQuery = query(collection(db, 'comments'), where('issueId', '==', id));
        const commentsSnapshot = await getDocs(commentsQuery);
        const deletePromises = commentsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return { success: true };
    } catch (error) {
        console.error('Error deleting issue:', error);
        return { success: false, error: error.message };
    }
};

// ==================== COMMENTS ====================

export const getComments = async (issueId) => {
    try {
        const commentsQuery = query(
            collection(db, 'comments'),
            where('issueId', '==', issueId)
        );
        const snapshot = await getDocs(commentsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

export const addComment = async (issueId, text) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        const newComment = {
            issueId,
            userId: currentUser.uid,
            text,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'comments'), newComment);

        return {
            success: true,
            comment: { id: docRef.id, ...newComment }
        };
    } catch (error) {
        console.error('Error adding comment:', error);
        return { success: false, error: error.message };
    }
};

export const updateComment = async (id, text) => {
    try {
        await updateDoc(doc(db, 'comments', id), {
            text,
            updatedAt: serverTimestamp()
        });

        const commentDoc = await getDoc(doc(db, 'comments', id));
        return {
            success: true,
            comment: { id: commentDoc.id, ...commentDoc.data() }
        };
    } catch (error) {
        console.error('Error updating comment:', error);
        return { success: false, error: error.message };
    }
};

export const deleteComment = async (id) => {
    try {
        await deleteDoc(doc(db, 'comments', id));
        return { success: true };
    } catch (error) {
        console.error('Error deleting comment:', error);
        return { success: false, error: error.message };
    }
};

// ==================== SPRINTS ====================

export const getSprints = async (projectId) => {
    try {
        const sprintsQuery = query(
            collection(db, 'sprints'),
            where('projectId', '==', projectId)
        );
        const snapshot = await getDocs(sprintsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching sprints:', error);
        return [];
    }
};

export const createSprint = async (projectId, sprintData) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        const newSprint = {
            projectId,
            name: sprintData.name,
            goal: sprintData.goal || '',
            startDate: sprintData.startDate || null,
            endDate: sprintData.endDate || null,
            status: 'planned',
            createdAt: serverTimestamp(),
            createdBy: currentUser.uid
        };

        const docRef = await addDoc(collection(db, 'sprints'), newSprint);

        return {
            success: true,
            sprint: { id: docRef.id, ...newSprint }
        };
    } catch (error) {
        console.error('Error creating sprint:', error);
        return { success: false, error: error.message };
    }
};

export const updateSprint = async (id, updates) => {
    try {
        await updateDoc(doc(db, 'sprints', id), updates);

        const sprintDoc = await getDoc(doc(db, 'sprints', id));
        return {
            success: true,
            sprint: { id: sprintDoc.id, ...sprintDoc.data() }
        };
    } catch (error) {
        console.error('Error updating sprint:', error);
        return { success: false, error: error.message };
    }
};

export const startSprint = async (id) => {
    return updateSprint(id, {
        status: 'active',
        startDate: new Date().toISOString()
    });
};

export const completeSprint = async (id) => {
    return updateSprint(id, {
        status: 'completed',
        endDate: new Date().toISOString()
    });
};

export const getActivities = (issueId) => {
    // Activities are stored within issues
    return getIssueById(issueId).then(issue => issue?.activities || []);
};

// ==================== REAL-TIME LISTENERS ====================

// Listen to projects changes
export const onProjectsChange = (callback) => {
    return onSnapshot(collection(db, 'projects'), (snapshot) => {
        const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(projects);
    });
};

// Listen to issues changes
export const onIssuesChange = (filters, callback) => {
    let issuesQuery = collection(db, 'issues');

    const constraints = [];
    if (filters.projectId) {
        constraints.push(where('projectId', '==', filters.projectId));
    }

    if (constraints.length > 0) {
        issuesQuery = query(issuesQuery, ...constraints);
    }

    return onSnapshot(issuesQuery, (snapshot) => {
        const issues = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(issues);
    });
};

// Listen to comments changes
export const onCommentsChange = (issueId, callback) => {
    const commentsQuery = query(
        collection(db, 'comments'),
        where('issueId', '==', issueId)
    );

    return onSnapshot(commentsQuery, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(comments);
    });
};
