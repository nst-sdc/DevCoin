import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { SignUpData, SignInData, User } from '../types/auth';

export const signUp = async (data: SignUpData): Promise<User> => {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const userData: User = {
      id: firebaseUser.uid,
      email: data.email,
      name: data.name,
      github: data.github,
      linkedin: data.linkedin,
      role: 'user',
      avatar: `https://avatars.githubusercontent.com/${data.github}`
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    await updateProfile(firebaseUser, { displayName: data.name });

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async ({ email, password }: SignInData): Promise<User> => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as User;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserRole = async (userId: string, role: User['role']): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    // Implementation will depend on your Firebase security rules and requirements
    await updateDoc(doc(db, 'users', userId), { 
      passwordLastUpdated: new Date().toISOString() 
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};