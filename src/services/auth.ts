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

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    // For demo purposes, we're only checking the super admin's password
    if (user.email === 'vivek.aryanvbw@gmail.com' && currentPassword !== 'Vivek@2024') {
      throw new Error('Current password is incorrect');
    }

    // In a real app, you would:
    // 1. Verify the current password hash matches
    // 2. Hash the new password
    // 3. Update the password in the database
    
    // For this demo, we'll just validate the password format
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(newPassword)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(newPassword)) {
      throw new Error('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      throw new Error('Password must contain at least one special character (!@#$%^&*)');
    }

    // Update the password (in a real app, this would be hashed)
    if (user.email === 'vivek.aryanvbw@gmail.com') {
      // For demo purposes, we're only actually changing the super admin's password
      user.password = newPassword;
      const updatedUsers = users.map(u => u.id === userId ? user : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};