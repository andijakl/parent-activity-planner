# Parent Activity Planner Setup Guide

This guide provides detailed instructions for setting up and deploying the Parent Activity Planner application, including Firebase authentication, Firebase Firestore configuration, and Firebase Hosting setup.

## Firebase Setup

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the prompts to create a new project
3. Enter a project name (e.g., "ParentActivityPlanner")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

### 2. Set Up Authentication
1. In the Firebase console, navigate to your project
2. Select "Authentication" from the left menu
3. Click "Get started"
4. Under "Sign-in providers", enable "Email/Password"
5. Click "Save"

### 3. Set Up Firestore Database
1. In the Firebase console, select "Firestore Database" from the left menu
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development)
   - For production, select "Production mode"
   - For testing, you can select "Test mode" which allows unrestricted access for 30 days
4. Select the Firestore location closest to your users
5. Click "Enable"

### 4. Create Firestore Security Rules
1. In the Firestore Database section, click the "Rules" tab
2. Replace the default rules with the following:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       
       match /activities/{activityId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null && 
           (resource.data.createdBy == request.auth.uid);
       }
       
       match /invitations/{invitationId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update: if request.auth != null;
       }
     }
   }
   ```
3. Click "Publish"

### 5. Register Your Web Application
1. On the Firebase project overview page, click the web icon (</>) to add a web app
2. Give your app a nickname (e.g., "Parent Activity Planner Web")
3. Check the "Also set up Firebase Hosting" option if you want to use Firebase Hosting
4. Click "Register app"
5. Copy the Firebase configuration object provided (will look like this):
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
6. Create a `.env` file in the root of your project with these values:
   ```
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_APP_ID
   ```

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd parent-activity-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with your Firebase configuration values as shown in the previous section.

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173` or another port if 5173 is already in use.

## Deployment with Firebase Hosting

### 1. Install Firebase CLI
If you haven't already installed the Firebase CLI, you can do so using npm:
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase in Your Project
```bash
firebase init
```

Select the following options:
- Select "Hosting: Configure files for Firebase Hosting"
- Select your Firebase project
- Specify `dist` as your public directory
- Configure as a single-page app (answer Yes)
- Set up automatic builds and deploys with GitHub (optional but recommended)

### 4. Build the Production Version
```bash
npm run build
```

### 5. Deploy to Firebase Hosting
```bash
firebase deploy
```

Your app will be deployed to a URL like `https://<your-project-id>.web.app`

### 6. Adding a Custom Domain (Optional)
1. In the Firebase console, go to "Hosting" under "Build"
2. Click "Add custom domain"
3. Follow the prompts to verify your domain ownership and set up DNS records

## Setting Up Continuous Deployment with GitHub Actions

### 1. Connect to GitHub
If you didn't set up GitHub integration during the `firebase init` step, you can do it now:
```bash
firebase init hosting:github
```

Follow the prompts to:
- Select your GitHub repository
- Set up the workflow to run on pushes to your main branch
- Optionally, set up a preview channel for pull requests

### 2. Push Your Code to GitHub
```bash
git add .
git commit -m "Setup Firebase hosting deployment"
git push
```

GitHub Actions will automatically build and deploy your app whenever you push to the main branch.

## Monitoring and Analytics

### 1. Firebase Analytics
If you enabled Google Analytics during project setup, you can view analytics data in the Firebase console:
1. Go to "Analytics" in the left sidebar
2. View user engagement, demographics, and events

### 2. Firebase Performance Monitoring
To set up performance monitoring:
1. Go to "Performance" in the left sidebar
2. Click "Get started"
3. Follow the setup instructions

### 3. Firebase Crashlytics
For crash reporting:
1. Go to "Crashlytics" in the left sidebar
2. Follow the setup instructions

## Troubleshooting

### Authentication Issues
- Check that your `.env` file contains the correct Firebase config values
- Ensure that Email/Password authentication is enabled in the Firebase console
- Check browser console for specific error messages

### Firestore Access Issues
- Verify your Firestore security rules
- Check that users are properly authenticated before accessing data
- Ensure your Firestore indexes are properly set up for any complex queries

### Deployment Issues
- Make sure you've built the project (`npm run build`) before deploying
- Check that your `firebase.json` file specifies the correct public directory
- Verify that you're logged in to the correct Firebase account