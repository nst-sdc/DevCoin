import { SignUpData, SignInData } from '../types/auth';
import { supabase, type User } from '../lib/supabase';
import { Provider } from '@supabase/supabase-js';

export const signUp = async (userData: SignUpData): Promise<User> => {
  try {
    // First sign up the user with Supabase Auth
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          github_username: userData.github_username,
          linkedin_url: userData.linkedin_url,
          avatar_url: userData.avatar_url
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('No user returned after signup');

    // Insert the user profile data into the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: userData.email,
        full_name: userData.full_name,
        github_username: userData.github_username,
        linkedin_url: userData.linkedin_url,
        avatar_url: userData.avatar_url,
        dev_coins: 0,
        is_admin: false,
        created_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // Wait a short moment for the auth session to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the session to ensure we're authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Failed to establish session');



    // Return the user data
    return {
      id: user.id,
      email: userData.email,
      github_username: userData.github_username,
      full_name: userData.full_name,
      linkedin_url: userData.linkedin_url,
      avatar_url: userData.avatar_url,
      dev_coins: 0,
      is_admin: false,
      created_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Signup error:', error);
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

    // If no profile exists (PGRST116) but we have a valid user, create the profile
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            dev_coins: 0,
            is_admin: false,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      if (!newProfile) throw new Error('Failed to create user profile');
      
      return newProfile;
    }

    if (profileError) throw profileError;
    if (!profile) throw new Error('User profile not found');

    return profile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithGitHub = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in with GitHub:', error);
    throw error;
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
