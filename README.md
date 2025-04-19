# Parent Activity Planner

A React application for parents to plan and coordinate activities with other parents.

## Features

- Create a simple account using child's nickname, email address, and password
- Calendar view to visualize and plan activities
- Create activities with name, date, time, and location
- Invite other parents via email or shareable code
- Connect with other parents to see their planned activities
- Join activities with a single click
- See who's joining each activity

## Technology Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS
- Authentication: Firebase Authentication
- Database: Azure Cosmos DB
- Hosting: Azure App Service

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase account
- Azure account with Cosmos DB

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd parent-activity-planner
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your Firebase and Azure Cosmos DB credentials

4. Start the development server
   ```
   npm run dev
   ```

### Deployment to Azure App Service

1. Build the production version of the app
   ```
   npm run build
   ```

2. Deploy to Azure App Service using the Azure CLI or GitHub Actions
   ```
   az webapp deployment source config-zip --resource-group <resource-group> --name <app-name> --src ./dist.zip
   ```

## Azure Resource Setup

### Cosmos DB Setup

1. Create a Cosmos DB account in Azure Portal (SQL API)
2. Create a database named "ParentActivities"
3. Create containers:
   - "users" - partition key: "/id"
   - "activities" - partition key: "/id"
   - "invitations" - partition key: "/id"
4. Add Cosmos DB connection details to your environment variables

### App Service Setup

1. Create an App Service plan (B1 or higher)
2. Create a Web App with Node.js stack
3. Configure environment variables in the App Service Configuration
4. Set up GitHub Actions or Azure DevOps for CI/CD

## License

This project is licensed under the MIT License.