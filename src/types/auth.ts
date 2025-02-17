export interface User {
  id: string;
  email: string;
  name: string;
  github: string;
  githubUsername?: string;
  githubId?: string;
  githubAccessToken?: string;
  linkedin?: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
  devCoins: number;
  contributions: Contribution[];
  joinedAt: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
}

export interface Contribution {
  id: string;
  type: 'PR' | 'COLLAB' | 'EVENT' | 'OTHER';
  description: string;
  coins: number;
  date: string;
  verified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  github: string;
  linkedin?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}