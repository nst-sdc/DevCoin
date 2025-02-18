export interface User {
  id: string;
  email: string;
  github_username?: string;
  avatar_url?: string;
  dev_coins: number;
  is_admin: boolean;
  created_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  github_username?: string;
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