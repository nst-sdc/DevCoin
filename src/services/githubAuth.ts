import { User } from '../types/auth';
import { setCurrentUser } from './localStore';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export const initiateGithubLogin = () => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
  window.location.href = githubAuthUrl;
};

export const handleGithubCallback = async (code: string): Promise<User> => {
  try {
    // Exchange code for access token
    const response = await fetch('/api/github/callback', {
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
