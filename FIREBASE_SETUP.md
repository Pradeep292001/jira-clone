# Firebase Setup Guide for Jira Clone

## 🔥 How to Get Your Own Firebase Config

Your Jira clone is now powered by Firebase for real-time multi-device collaboration! Follow these steps to connect it to your own Firebase project:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `jira-clone` (or your choice)
4. Disable Google Analytics (optional, not needed)
5. Click **"Create Project"**
6. Wait for project creation (~30 seconds)

### Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (</>)
2. App nickname: `jira-clone-web`
3. **Don't** check "Firebase Hosting"
4. Click **"Register app"**

### Step 3: Get Your Configuration

Copy the `firebaseConfig` object shown. It will look like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
  authDomain: "jira-clone-xxxxx.firebaseapp.com",
  projectId: "jira-clone-xxxxx",
  storageBucket: "jira-clone-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 4: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"** under Sign-in providers
4. **Enable** the toggle
5. Click **"Save"**

### Step 5: Enable Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose your location (closest to your users)
5. Click **"Enable"**

### Step 6: Update Your App Config

1. Open `src/services/firebase.js`
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 7: Set Up Security Rules (Important!)

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## ✅ You're All Set!

Your app now has:
- ✨ Real-time synchronization across devices
- 🔐 Secure authentication
- ☁️ Cloud data storage
- 🚀 Multi-user collaboration

## 🎉 Firebase Free Tier Limits

Perfect for your Jira clone:
- **Users**: Unlimited
- **Database**: 1 GB storage
- **Data transfer  **: 10 GB/month
- **Authentication**: 10K users/month
- **All features**: Free forever for small teams!

## 🔒 Optional: Production Security Rules

For production, use stricter rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
    
    match /issues/{issueId} {
      allow read, write: if request.auth != null;
    }
    
    match /comments/{commentId} {
      allow read, write: if request.auth != null;
    }
    
    match /sprints/{sprintId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🐛 Troubleshooting

**Problem**: "Firebase: Error (auth/configuration-not-found)"
- **Solution**: Make sure you enabled Email/Password in Authentication

**Problem**: "Missing or insufficient permissions"
- **Solution**: Check Firestore rules are set to allow authenticated users

**Problem**: App not loading
- **Solution**: Check browser console for errors, verify Firebase config is correct

## 📚 Learn More

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth](https://firebase.google.com/docs/auth)

---

**Need help?** Check the [Firebase Console](https://console.firebase.google.com) for your project status!
