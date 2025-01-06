import { User, SignUpData } from '../types/auth';

const USERS_KEY = 'dev_club_users';
const CURRENT_USER_KEY = 'dev_club_current_user';

// Initialize with super admin
const initializeStore = () => {
  const users = getUsers();
  if (users.length === 0) {
    const superAdmin: User = {
      id: '1',
      email: 'vivek.aryanvbw@gmail.com',
      name: 'Vivek W',
      github: 'aryanvbw',
      role: 'super_admin',
      avatar: `https://avatars.githubusercontent.com/aryanvbw`,
      devCoins: 100
    };
    setUsers([superAdmin]);
  }
};

// User Management
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const setUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addUser = (userData: SignUpData): User => {
  const users = getUsers();
  const existingUser = users.find(u => u.email === userData.email);
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: (users.length + 1).toString(),
    email: userData.email,
    name: userData.name,
    github: userData.github,
    linkedin: userData.linkedin,
    role: 'user',
    avatar: `https://avatars.githubusercontent.com/${userData.github}`,
    devCoins: 0
  };

  setUsers([...users, newUser]);
  return newUser;
};

// Current User Management
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// User Operations
export const updateUserRole = (userId: string, role: User['role']): User => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = { ...users[userIndex], role };
  users[userIndex] = updatedUser;
  setUsers(users);

  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
};

export const updateUserPassword = (userId: string, newPassword: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // In a real app, you'd hash the password. Here we're just storing it for demo
  users[userIndex] = { ...users[userIndex], password: newPassword };
  setUsers(users);
};

export const updateUserProfile = (userId: string, userData: Partial<User>): User => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Update user data while preserving existing fields
  const updatedUser = { 
    ...users[userIndex],
    ...userData,
    // Preserve these fields
    id: users[userIndex].id,
    role: users[userIndex].role,
    devCoins: users[userIndex].devCoins
  };

  users[userIndex] = updatedUser;
  setUsers(users);

  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }

  return updatedUser;
};

// Initialize store with super admin
initializeStore();