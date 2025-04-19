import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword as firebaseCreateUser, 
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  Auth,
  UserCredential
} from 'firebase/auth';

// For Firebase configuration, you would normally load this from environment variables
// This is a placeholder configuration, replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
  return firebaseCreateUser(auth, email, password);
}

function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
  return firebaseSignIn(auth, email, password);
}

export { 
  auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut as signOut 
};