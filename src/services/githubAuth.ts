import { User } from '../types/auth';
import { setCurrentUser } from './localStore';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export const initiateGithubLogin = () => {
  // Production configuration for nstsdc.org
  const encodedRedirectUri = encodeURIComponent(GITHUB_REDIRECT_URI);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodedRedirectUri}&scope=user:email,read:user,user:follow`;
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

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      throw new Error('Failed to get access token from GitHub');
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
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
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email || githubUser.email;

    // Create user object with GitHub data
    const user: User = {
      id: `github_${githubUser.id}`,
      email: primaryEmail,
      name: githubUser.name || githubUser.login,
      github: githubUser.html_url,
      githubUsername: githubUser.login,
      githubId: githubUser.id.toString(),
      githubAccessToken: access_token,
      role: 'user',
      avatar: githubUser.avatar_url,
      bio: githubUser.bio,
      location: githubUser.location,
      company: githubUser.company,
      blog: githubUser.blog,
      devCoins: 0,
      contributions: [],
      joinedAt: new Date().toISOString(),
    };

    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with GitHub');
    }

    const data = await response.json();
    const { access_token } = data;

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from GitHub');
    }

    const githubUser = await userResponse.json();

    // Create user object
    const user: User = {
      id: `github_${githubUser.id}`,
      email: githubUser.email,
      name: githubUser.name || githubUser.login,
      username: githubUser.login,
      avatarUrl: githubUser.avatar_url,
      role: 'member',
      githubUsername: githubUser.login,
      createdAt: new Date().toISOString(),
    };

    // Store user in local storage
    setCurrentUser(user);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
