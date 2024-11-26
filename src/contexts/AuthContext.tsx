import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { signIn, signUp, signOut as firebaseSignOut } from '../services/auth';
import type { User, SignInData, SignUpData, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setState({
              user: userDoc.data() as User,
              loading: false,
              error: null,
            });
          } else {
            setState({
              user: null,
              loading: false,
              error: 'User data not found',
            });
          }
        } catch (error) {
          setState({
            user: null,
            loading: false,
            error: 'Failed to fetch user data',
          });
        }
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    ...state,
    signIn: async (data: SignInData) => {
      try {
        const user = await signIn(data);
        setState({ user, loading: false, error: null });
      } catch (error: any) {
        setState({ user: null, loading: false, error: error.message });
        throw error;
      }
    },
    signUp: async (data: SignUpData) => {
      try {
        const user = await signUp(data);
        setState({ user, loading: false, error: null });
      } catch (error: any) {
        setState({ user: null, loading: false, error: error.message });
        throw error;
      }
    },
    signOut: async () => {
      try {
        await firebaseSignOut();
        setState({ user: null, loading: false, error: null });
      } catch (error: any) {
        setState(prev => ({ ...prev, error: error.message }));
        throw error;
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}