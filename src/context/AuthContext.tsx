import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from '../services/firebase';
import { createUser, getUserByEmail, getUserById } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, childNickname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signUp(email: string, password: string, childNickname: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Create user in our database
      const newUser: User = {
        id: uid,
        email,
        childNickname,
        friends: []
      };
      
      await createUser(newUser);
      setCurrentUser(newUser);
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await getUserByEmail(email);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setCurrentUser(null);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // First try to get user by email
          try {
            const userInfo = await getUserByEmail(user.email!);
            setCurrentUser(userInfo);
          } catch (emailError) {
            console.warn('Failed to get user by email, trying by ID:', emailError);
            // If that fails, try by ID
            const userById = await getUserById(user.uid);
            setCurrentUser(userById);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Create minimal user object to avoid null issues
          setCurrentUser({
            id: user.uid,
            email: user.email || '',
            childNickname: '',
            friends: []
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}