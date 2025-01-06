export interface User {
  id: string;
  email: string;
  name: string;
  github: string;
  linkedin?: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
  devCoins: number;
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