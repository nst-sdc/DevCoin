import { SignUpData, SignInData, User } from '../types/auth';
import { addUser, getUsers, getCurrentUser, setCurrentUser } from './localStore';

export const signUp = async (data: SignUpData): Promise<User> => {
  try {
    const newUser = addUser(data);
    setCurrentUser(newUser);
    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async ({ email, password }: SignInData): Promise<User> => {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you'd verify the hashed password
    // For demo purposes, we're allowing any password for the super admin
    if (email === 'vivek.aryanvbw@gmail.com' && password === 'Vivek@2024') {
      setCurrentUser(user);
      return user;
    }

    // For other users, check if they exist (we're not storing passwords in this demo)
    if (user) {
      setCurrentUser(user);
      return user;
    }

    throw new Error('Invalid credentials');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  setCurrentUser(null);
};

export const getCurrentSession = (): User | null => {
  return getCurrentUser();
};