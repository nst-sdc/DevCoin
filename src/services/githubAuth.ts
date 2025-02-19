import { User } from '../types/auth';
import { supabase } from '../lib/supabase';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export const initiateGithubLogin = () => {
  const encodedRedirectUri = encodeURIComponent(GITHUB_REDIRECT_URI);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodedRedirectUri}&scope=user:email,read:user`;
  window.location.href = githubAuthUrl;
};

export const handleGithubCallback = async (code: string): Promise<User> => {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token from GitHub');
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user info from GitHub');
    }
    
    const githubUser = await userResponse.json();

    // Get user's email from GitHub
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });
    
    const emails = await emailResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email || githubUser.email;

    // Sign in with Supabase using GitHub token
    const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithGithub({
      provider: 'github',
      access_token: tokenData.access_token,
    });

    if (signInError || !authUser) {
      throw new Error(signInError?.message || 'Failed to sign in with GitHub');
    }

    // Check if user exists in our users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
      throw new Error('Failed to check existing user');
    }

    if (!existingUser) {
      // Create new user profile
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: primaryEmail,
            github_username: githubUser.login,
            avatar_url: githubUser.avatar_url,
            dev_coins: 0,
            is_admin: false,
          },
        ])
        .select()
        .single();

      if (createError || !newUser) {
        throw new Error('Failed to create user profile');
      }

      return newUser;
    }

    return existingUser;
  } catch (error: any) {
    console.error('GitHub auth error:', error);
    throw new Error(error.message);
  }
};
