# 📋 Jira Clone - Project Management Application

A comprehensive project management application built with React and **Firebase**, featuring Kanban boards, sprint planning, and **real-time multi-device collaboration** - just like Jira!

![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646cff?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-ffca28?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 NEW: Multi-Device Collaboration!

This app now uses **Firebase** for real-time sync across multiple devices:
- ✨ Changes appear instantly on all devices
- ☁️ Cloud data storage (not browser-only anymore!)
- 👥 Multiple users can collaborate in real-time
- 🔐 Secure Firebase Authentication

**⚠️ Firebase Setup Required** - See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for 5-minute setup

## ✨ Features

- 🔐 **User Authentication** - Login/Register with role-based access
- 📊 **Dashboard** - Overview of projects, issues, and activity
- 📁 **Project Management** - Create and manage multiple projects
- 📋 **Kanban Board** - Drag-and-drop interface for issue tracking
- 🎯 **Issue Management** - Create, edit, comment, and track issues
- 🏃 **Sprint Planning** - Organize work into sprints
- 💬 **Comments** - Collaborate on issues
- 🎨 **Premium Dark Theme** - Beautiful modern UI with glassmorphism

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- **Firebase account** (free) - [Create one here](https://firebase.google.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/Pradeep292001/jira-clone.git

# Navigate to project directory
cd jira-clone

# Install dependencies
npm install

# ⚠️ IMPORTANT: Set up Firebase
# Follow the guide in FIREBASE_SETUP.md to:
# 1. Create Firebase project
# 2. Enable Authentication & Firestore
# 3. Update src/services/firebase.js with your config

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

**First time?** You'll need to register a new account since Firebase starts empty.

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Drag & Drop**: @hello-pangea/dnd
- **Styling**: CSS Custom Properties
- **Data Storage**: localStorage API
- **State Management**: React Context

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context providers
├── pages/           # Main application pages
├── services/        # API and data services
├── utils/           # Helper functions
└── index.css        # Global styles
```

## 🎯 Key Features

### Issue Types
- 📖 **Story** - User stories and features
- ✓ **Task** - Regular tasks
- 🐛 **Bug** - Bug reports
- ⚡ **Epic** - Large features

### Priority Levels
- 🔥 Highest
- ⬆️ High
- ➡️ Medium
- ⬇️ Low
- 📋 Lowest

### Workflow States
- To Do
- In Progress
- In Review
- Done

## 📸 Screenshots

### Dashboard
Overview of all projects and tasks with stats

### Kanban Board
Drag and drop interface for managing issues

### Issue Detail
Comprehensive issue tracking with comments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React and Vite

## 🙏 Acknowledgments

- Inspired by Atlassian Jira
- Icons from emoji set
- Design inspired by modern web applications

---

**Start managing your projects efficiently!** 🚀
