# Parent Activity Planner

A beautifully designed React application for parents to plan and coordinate activities with other parents and their children.

![Parent Activity Planner](https://via.placeholder.com/800x400?text=Parent+Activity+Planner)

## Features

- Create a simple account using child's nickname, email address, and password
- Beautiful, responsive calendar view to visualize and plan activities
- Create activities with name, date, time, and location
- Invite other parents via email or shareable code
- Connect with other parents to see their planned activities
- Join activities with a single click
- See who's joining each activity
- Mobile-friendly design that works on all devices

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with beautiful responsive UI
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase account (free tier works fine)

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

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server
   ```
   npm run dev
   ```

### Deployment to Firebase Hosting

1. Install Firebase CLI
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```
   firebase login
   ```

3. Initialize Firebase in your project
   ```
   firebase init
   ```
   
   Select Firebase Hosting and follow the prompts.

4. Build the production version of the app
   ```
   npm run build
   ```

5. Deploy to Firebase Hosting
   ```
   firebase deploy
   ```

See [setup.md](./setup.md) for detailed setup and deployment instructions.

## Firebase Configuration

### Authentication

The app uses Firebase Authentication with email/password method. You need to enable this in your Firebase project.

### Firestore Database

The app uses Firebase Firestore with the following collections:
- **users**: Stores user information
- **activities**: Stores activity details
- **invitations**: Stores friend invitation data

### Security Rules

Ensure your Firestore security rules are set up properly to protect your data. See the setup guide for recommended rules.

## Development

### Project Structure

```
src/
├── components/   # Reusable UI components
├── context/      # React Context providers
├── pages/        # Page components
├── services/     # Firebase and API services
├── types/        # TypeScript interfaces
└── utils/        # Helper functions
```

### Commands

- **Development**: `npm run dev` - Start the development server
- **Build**: `npm run build` - Build the production version
- **Lint**: `npm run lint` - Run ESLint on the codebase
- **Preview**: `npm run preview` - Preview the production build locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)