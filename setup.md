# Parent Activity Planner Setup Guide

This guide provides detailed instructions for setting up and deploying the Parent Activity Planner application, including Firebase authentication, Azure Cosmos DB configuration, and Azure App Service deployment.

## Firebase Authentication Setup

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

### 3. Register Your Web Application
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
6. Add these values to your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=YOUR_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   VITE_FIREBASE_APP_ID=YOUR_APP_ID
   ```

## Azure Cosmos DB Setup

### 1. Create a Cosmos DB Account
1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Cosmos DB" and select "Azure Cosmos DB"
4. Click "Create"
5. Select "NoSQL" as the API
6. Choose your subscription and resource group (create a new one if necessary)
7. Enter an account name (e.g., "parent-activity-db")
8. Choose the location closest to your users
9. Select "Capacity mode" as "Provisioned throughput" for production or "Serverless" for development
10. Click "Review + create", then "Create"

### 2. Create a Database and Containers
1. Once your Cosmos DB account is created, navigate to it in the Azure Portal
2. Go to "Data Explorer"
3. Click "New Database"
4. Enter "ParentActivities" as the database ID
5. Select throughput option (Autoscale recommended for production, Manual for testing)
   - For minimal costs, use Manual with 400 RU/s
6. Click "OK"
7. With the new database selected, click "New Container"
8. Create the following containers:

   a. **Users Container**
   - Container ID: `users`
   - Partition key: `/id`
   - RU/s: minimum (400 RU/s)
   - Click "OK"

   b. **Activities Container**
   - Container ID: `activities`
   - Partition key: `/id`
   - RU/s: minimum (400 RU/s)
   - Click "OK"

   c. **Invitations Container**
   - Container ID: `invitations`
   - Partition key: `/id`
   - RU/s: minimum (400 RU/s)
   - Click "OK"

### 3. Get Connection Details
1. In your Cosmos DB account, go to "Keys" in the left menu
2. Copy the "URI" and "PRIMARY KEY"
3. Add these to your `.env` file:
   ```
   VITE_COSMOS_ENDPOINT=YOUR_COSMOS_DB_URI
   VITE_COSMOS_KEY=YOUR_COSMOS_DB_PRIMARY_KEY
   VITE_COSMOS_DATABASE_ID=ParentActivities
   ```

## Hosting Options for Static Site Deployment

Since this is a static single-page application (SPA), you have two primary hosting options that are simpler and more cost-effective than traditional Azure App Service deployment.

### Option 1: Firebase Hosting (Recommended)

Firebase Hosting is the simplest option since you're already using Firebase for authentication, and it's optimized for serving static sites with SPA routing.

#### 1. Set Up Firebase Hosting
1. Make sure you have the Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting in your project directory:
   ```bash
   firebase init hosting
   ```
   - Select the Firebase project you created earlier
   - Specify `dist` as your public directory
   - Configure as a single-page app (answer Yes to "Configure as a single-page app")
   - Don't overwrite your index.html

4. Create a `.env` file with all your environment variables (Firebase and Cosmos DB)

5. Build the application:
   ```bash
   npm run build
   ```

6. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

7. Your app will be available at `https://<your-project-id>.web.app`

#### 2. Set Up Automatic Deployment with GitHub Actions
1. In your project directory, run:
   ```bash
   firebase init hosting:github
   ```
   
2. This will set up GitHub Actions to automatically build and deploy your project when you push to your repository.

3. The workflow will:
   - Install dependencies
   - Build the application
   - Deploy to Firebase Hosting

### Option 2: Azure Static Web Apps

If you prefer to keep everything in the Azure ecosystem (since Cosmos DB is already on Azure), Azure Static Web Apps is a good alternative.

#### 1. Create an Azure Static Web App
1. Go to the Azure Portal
2. Click "Create a resource"
3. Search for "Static Web App" and select it
4. Click "Create"
5. Select your subscription and resource group (use the same one as Cosmos DB)
6. Enter a name for your static web app
7. Select a hosting plan (Free tier is sufficient for most use cases)
8. Choose the region closest to your users
9. Under "Deployment details":
   - Select GitHub as the source
   - Connect your GitHub account and select your repository
10. Under "Build details":
    - Select "React" as the build preset
    - Set "App location" to "/"
    - Set "Output location" to "dist"
11. Click "Review + create", then "Create"

#### 2. Configure Environment Variables
1. Once your Static Web App is created, navigate to it in the Azure Portal
2. Go to "Configuration" in the left menu
3. Add all your environment variables:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   VITE_COSMOS_ENDPOINT
   VITE_COSMOS_KEY
   VITE_COSMOS_DATABASE_ID
   ```
4. Click "Save"

This creates a GitHub Actions workflow file in your repository. On the next push, GitHub Actions will build and deploy your application automatically.

### 3. Verify Deployment
1. Navigate to your hosting URL (either Firebase or Azure Static Web Apps)
2. Verify that the application loads correctly
3. Test user registration, authentication, and other features

## Monitoring and Troubleshooting

### App Service Logs
1. In the Azure Portal, navigate to your Web App
2. Go to "Log stream" to see real-time logs
3. Go to "App Service logs" to configure logging options

### Cosmos DB Monitoring
1. Navigate to your Cosmos DB account
2. Go to "Metrics" to see performance data
3. Go to "Data Explorer" to query and modify your data directly

## Production Considerations

### 1. Scale Your App Service
- For production traffic, consider scaling up your App Service Plan to at least a Standard tier (S1) for better performance and reliability

### 2. Optimize Cosmos DB Costs
- Monitor RU usage and adjust provisioned throughput accordingly
- Consider using the serverless option for development/test environments
- Set up Time-to-Live (TTL) for ephemeral data to reduce storage costs

### 3. Set up Custom Domain and SSL
1. Purchase a domain name from a domain registrar
2. In your Azure App Service, go to "Custom domains"
3. Follow the instructions to add your domain and set up SSL

### 4. Set up Application Insights
1. In your Azure App Service, go to "Application Insights"
2. Enable Application Insights to monitor performance and user behavior