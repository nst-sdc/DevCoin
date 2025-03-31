import { Octokit } from '@octokit/rest';

// Log when the GitHub service is initialized
console.log('Initializing GitHub service...');

// Create Octokit instance with the token from environment variables
const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

// Log that Octokit has been initialized (without exposing the token)
console.log('Octokit initialized with auth token:', import.meta.env.VITE_GITHUB_TOKEN ? 'Token provided' : 'No token provided');

export interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updatedAt: string;
  openIssues: number;
  pullRequests: PullRequest[];
}

export interface PullRequest {
  id: number;
  title: string;
  url: string;
  author: string;
  createdAt: string;
  status: 'open' | 'closed' | 'merged';
  additions: number;
  deletions: number;
}

export interface UserContribution {
  id: string;
  type: 'PR' | 'ISSUE' | 'COMMIT';
  title: string;
  description: string;
  url: string;
  createdAt: string;
  repository: string;
  status: string;
  points: number;
}

export const fetchRepositories = async (): Promise<Repository[]> => {
  console.log('Fetching repositories...');
  
  // Check if GitHub token is configured
  if (!import.meta.env.VITE_GITHUB_TOKEN) {
    console.error('GitHub token is not configured in .env file');
    throw new Error('GitHub token is not configured. Please set VITE_GITHUB_TOKEN in your .env file.');
  }
  
  // Get organization name from environment variables or use default
  const orgName = import.meta.env.VITE_GITHUB_ORG || 'NST-SDC';
  console.log('Using organization:', orgName);

  try {
    console.log(`Calling GitHub API to list repositories for org: ${orgName}`);
    let repos = [];
    
    try {
      // First attempt: Try to get repositories from the organization
      const { data } = await octokit.repos.listForOrg({
        org: orgName,
        sort: 'updated',
        direction: 'desc',
        per_page: 100
      });
      repos = data;
      console.log(`Found ${repos.length} repositories in the organization ${orgName}`);
    } catch (orgError: any) {
      console.warn(`Error fetching repos for org ${orgName}:`, orgError.message);
      
      // If organization approach fails, try getting user's repositories instead
      console.log('Attempting to fetch repositories for the authenticated user...');
      try {
        const { data: userRepos } = await octokit.repos.listForAuthenticatedUser({
          sort: 'updated',
          direction: 'desc',
          per_page: 100
        });
        
        // Filter to only include repositories from the target organization if specified
        repos = userRepos.filter(repo => 
          !orgName || repo.owner.login.toLowerCase() === orgName.toLowerCase()
        );
        
        console.log(`Found ${repos.length} repositories for the authenticated user`);
      } catch (userError: any) {
        console.error('Error fetching user repositories:', userError.message);
        throw userError; // Re-throw to be caught by the outer catch block
      }
    }
    
    if (repos.length === 0) {
      console.warn('No repositories found. This might indicate an issue with permissions or the organization name.');
      // Try one more approach - search for repositories
      try {
        console.log(`Searching for repositories in ${orgName}...`);
        const { data } = await octokit.search.repos({
          q: `org:${orgName}`,
          sort: 'updated',
          order: 'desc',
          per_page: 100
        });
        
        repos = data.items;
        console.log(`Found ${repos.length} repositories through search`);
      } catch (searchError: any) {
        console.warn('Error searching for repositories:', searchError.message);
      }
    }

    const repositories = await Promise.all(repos.map(async repo => {
      const { data: pulls } = await octokit.pulls.list({
        owner: orgName,
        repo: repo.name,
        state: 'all',
        per_page: 10,
        sort: 'updated',
        direction: 'desc'
      });

      // Fetch additional PR details to get additions and deletions
      const pullRequests = await Promise.all(pulls.map(async pr => {
        // Get detailed PR info including additions and deletions
        let additions = 0;
        let deletions = 0;
        
        try {
          const { data: prDetails } = await octokit.pulls.get({
            owner: orgName,
            repo: repo.name,
            pull_number: pr.number
          });
          additions = prDetails.additions || 0;
          deletions = prDetails.deletions || 0;
        } catch (error) {
          console.error(`Error fetching PR details for ${pr.number}:`, error);
        }
        
        return {
          id: pr.id,
          title: pr.title,
          url: pr.html_url,
          author: pr.user?.login || 'Unknown',
          createdAt: pr.created_at,
          status: pr.merged_at ? 'merged' : (pr.state === 'open' || pr.state === 'closed' ? pr.state : 'open') as 'open' | 'closed' | 'merged',
          additions,
          deletions
        };
      }));

      return {
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        stars: repo.stargazers_count || 0, // Ensure it's always a number
        language: repo.language || 'Unknown',
        updatedAt: repo.updated_at || new Date().toISOString(), // Ensure it's always a string
        openIssues: repo.open_issues_count || 0, // Ensure it's always a number
        pullRequests
      };
    }));

    return repositories;
  } catch (error: any) {
    console.error('Error fetching repositories:', error);
    
    // Check if we can get rate limit information
    try {
      const { data: rateLimit } = await octokit.rateLimit.get();
      console.log('GitHub API Rate Limit Status:', {
        limit: rateLimit.rate.limit,
        remaining: rateLimit.rate.remaining,
        reset: new Date(rateLimit.rate.reset * 1000).toLocaleString()
      });
    } catch (rateLimitError) {
      console.error('Could not fetch rate limit information');
    }
    
    // Provide more specific error messages based on common issues
    if (error.status === 401) {
      console.error('Authentication error: The provided GitHub token is invalid or expired.');
      throw new Error('GitHub authentication failed. Please check your token.');
    } else if (error.status === 403) {
      console.error('Permission error: The token does not have sufficient permissions or rate limit exceeded.');
      throw new Error('GitHub permission denied. Your token may not have the required permissions or rate limit exceeded.');
    } else if (error.status === 404) {
      console.error(`Not found error: The organization "${orgName}" might not exist or you don\'t have access to it.`);
      throw new Error(`Organization "${orgName}" not found or not accessible with your token.`);
    }
    
    console.error('Detailed error:', JSON.stringify(error, null, 2));
    return [];
  }
};

export const fetchUserContributions = async (username: string): Promise<UserContribution[]> => {
  // Get organization name from environment variables or use default
  const orgName = import.meta.env.VITE_GITHUB_ORG || 'NST-SDC';
  try {
    // Fetch pull requests
    const { data: pullRequests } = await octokit.search.issuesAndPullRequests({
      q: `author:${username} type:pr org:${orgName}`,
      sort: 'created',
      order: 'desc',
      per_page: 100
    });

    // Fetch issues
    const { data: issues } = await octokit.search.issuesAndPullRequests({
      q: `author:${username} type:issue org:${orgName}`,
      sort: 'created',
      order: 'desc',
      per_page: 100
    });

    // Process pull requests
    const prContributions = pullRequests.items.map(pr => ({
      id: pr.id.toString(),
      type: 'PR' as const,
      title: pr.title,
      description: pr.body || '',
      url: pr.html_url,
      createdAt: pr.created_at,
      repository: pr.repository_url.split('/').pop() || '',
      status: pr.state,
      points: calculatePoints(pr)
    }));

    // Process issues
    const issueContributions = issues.items.map(issue => ({
      id: issue.id.toString(),
      type: 'ISSUE' as const,
      title: issue.title,
      description: issue.body || '',
      url: issue.html_url,
      createdAt: issue.created_at,
      repository: issue.repository_url.split('/').pop() || '',
      status: issue.state,
      points: calculatePoints(issue)
    }));

    return [...prContributions, ...issueContributions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    return [];
  }
};

const calculatePoints = (contribution: any): number => {
  let points = 0;

  // Base points
  if (contribution.pull_request) {
    points += 30; // Base points for PR
    if (contribution.merged) points += 20; // Additional points for merged PRs
  } else {
    points += 10; // Base points for issues
  }

  // Additional points based on labels
  const labels = contribution.labels || [];
  for (const label of labels) {
    switch (label.name.toLowerCase()) {
      case 'bug':
        points += 15;
        break;
      case 'enhancement':
        points += 20;
        break;
      case 'documentation':
        points += 10;
        break;
      case 'major':
        points += 30;
        break;
    }
  }

  return points;
};