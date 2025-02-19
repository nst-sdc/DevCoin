import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

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
  if (!import.meta.env.VITE_GITHUB_TOKEN) {
    throw new Error('GitHub token is not configured. Please set VITE_GITHUB_TOKEN in your .env file.');
  }

  try {
    const { data: repos } = await octokit.repos.listForOrg({
      org: 'AryanVBW',  // Updated to match your organization
      sort: 'updated',
      direction: 'desc',
      per_page: 100
    });

    const repositories = await Promise.all(repos.map(async repo => {
      const { data: pulls } = await octokit.pulls.list({
        owner: 'nst-sdc',
        repo: repo.name,
        state: 'all',
        per_page: 10,
        sort: 'updated',
        direction: 'desc'
      });

      const pullRequests = pulls.map(pr => ({
        id: pr.id,
        title: pr.title,
        url: pr.html_url,
        author: pr.user?.login || 'Unknown',
        createdAt: pr.created_at,
        status: pr.merged_at ? 'merged' : pr.state as 'open' | 'closed',
        additions: pr.additions || 0,
        deletions: pr.deletions || 0
      }));

      return {
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language || 'Unknown',
        updatedAt: repo.updated_at,
        openIssues: repo.open_issues_count,
        pullRequests
      };
    }));

    return repositories;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};

export const fetchUserContributions = async (username: string): Promise<UserContribution[]> => {
  try {
    // Fetch pull requests
    const { data: pullRequests } = await octokit.search.issuesAndPullRequests({
      q: `author:${username} type:pr org:NST-SDC`,
      sort: 'created',
      order: 'desc',
      per_page: 100
    });

    // Fetch issues
    const { data: issues } = await octokit.search.issuesAndPullRequests({
      q: `author:${username} type:issue org:NST-SDC`,
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