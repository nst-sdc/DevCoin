import { SignUpData, SignInData } from '../types/auth';
import { supabase, type User } from '../lib/supabase';

export const signUp = async ({ email, password, github_username }: SignUpData): Promise<User> => {
  try {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!user) throw new Error('No user returned after signup');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: user.id,
          email,
          github_username,
          dev_coins: 0,
          is_admin: false,
        },
      ])
      .select()
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('Failed to create user profile');

    return profile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async ({ email, password }: SignInData): Promise<User> => {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!user) throw new Error('No user returned after login');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('User profile not found');

    return profile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async (): Promise<User | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return null;

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    if (!profile) {
      // If no profile exists but we have a session, create one
      if (session.user.app_metadata.provider === 'github') {
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              github_username: session.user.user_metadata.user_name,
              avatar_url: session.user.user_metadata.avatar_url,
              dev_coins: 0,
              is_admin: false,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return null;
        }

        return newProfile;
      }
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return null;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
