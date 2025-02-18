import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  email: string;
  github_username?: string;
  avatar_url?: string;
  dev_coins: number;
  is_admin: boolean;
  created_at: string;
};

export type Project = {
  id: string;
  github_id: number;
  name: string;
  description?: string;
  url: string;
  status: 'open' | 'assigned' | 'completed';
  assigned_to?: string;
  assigned_at?: string;
  created_at: string;
  updated_at: string;
  language?: string;
  stars?: number;
};

export type Contribution = {
  id: string;
  user_id: string;
  project_id: string;
  description: string;
  pull_request_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  dev_coins_earned?: number;
  created_at: string;
  approved_at?: string;
};
