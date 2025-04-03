import { Octokit } from '@octokit/rest';
import { cacheService } from './cache';

// Log when the GitHub service is initialized
console.log('Initializing GitHub service...');

// Create Octokit instance with the token from environment variables
const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

// Log that Octokit has been initialized (without exposing the token)
console.log('Octokit initialized with auth token:', import.meta.env.VITE_GITHUB_TOKEN ? 'Token provided' : 'No token provided');

// Cache keys
const CACHE_KEYS = {
  ORGANIZATION_MEMBERS: 'organization_members',
  LEADERBOARD_ALL: 'leaderboard_all',
  LEADERBOARD_MONTH: 'leaderboard_month',
  LEADERBOARD_WEEK: 'leaderboard_week'
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
  ORGANIZATION_MEMBERS: 5 * 60 * 60 * 1000, // 5 hours
  LEADERBOARD: 2 * 60 * 60 * 1000 // 2 hours
};

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
  fork: boolean;
  parentRepo?: {
    name: string;
    owner: string;
  };
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

export interface UserStats {
  username: string;
  name: string;
  avatarUrl: string;
  totalLinesOfCode: number;
  mergedPullRequests: number;
  openPullRequests: number;
  devCoins: number;
}

export interface GithubMember {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  email: string;
  company: string;
  location: string;
  blog: string;
  twitterUsername: string;
  teamNames: string[];
  role: string; // 'admin', 'member', or 'outside'
  contributions: {
    totalLinesOfCode: number;
    mergedPullRequests: number;
    openPullRequests: number;
  };
  devCoins: number;
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
        per_page: 100,
        type: 'all' // Include both regular and forked repos
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
      // Get parent repo info if it's a fork
      let parentRepo = undefined;
      if (repo.fork) {
        try {
          const { data: repoData } = await octokit.repos.get({
            owner: repo.owner.login,
            repo: repo.name
          });
          
          if (repoData.parent) {
            parentRepo = {
              name: repoData.parent.name,
              owner: repoData.parent.owner.login
            };
          }
        } catch (error) {
          console.error(`Error fetching parent repo info for ${repo.name}:`, error);
        }
      }

      const { data: pulls } = await octokit.pulls.list({
        owner: repo.owner.login,
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
            owner: repo.owner.login,
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
        stars: repo.stargazers_count || 0,
        language: repo.language || 'Unknown',
        updatedAt: repo.updated_at || new Date().toISOString(),
        openIssues: repo.open_issues_count || 0,
        pullRequests,
        fork: repo.fork || false,
        parentRepo
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

/**
 * Fetches leaderboard data showing users ranked by their GitHub contributions
 * Includes lines of code, merged PRs, and open PRs
 */
export const fetchLeaderboardData = async (timeFrame: 'all' | 'month' | 'week' = 'all'): Promise<UserStats[]> => {
  // Determine cache key based on timeFrame
  const cacheKey = timeFrame === 'all' 
    ? CACHE_KEYS.LEADERBOARD_ALL 
    : timeFrame === 'month' 
      ? CACHE_KEYS.LEADERBOARD_MONTH 
      : CACHE_KEYS.LEADERBOARD_WEEK;
      
  // Try to get data from cache
  const cachedData = cacheService.get<UserStats[]>(cacheKey);
  if (cachedData) {
    console.log(`Using cached leaderboard data for timeFrame: ${timeFrame}`);
    return cachedData;
  }
  
  console.log(`Fetching fresh leaderboard data for timeFrame: ${timeFrame}...`);
  try {
    const orgName = import.meta.env.VITE_GITHUB_ORG || 'NST-SDC';
    console.log(`Fetching leaderboard data for ${orgName} with timeframe: ${timeFrame}`);

    // Get repositories including forks
    const repositories = await fetchRepositories();
    
    // Track user stats
    const userStatsMap = new Map<string, UserStats>();
    
    // Calculate date limit based on timeframe
    let dateLimit: Date | null = null;
    const now = new Date();
    if (timeFrame === 'month') {
      dateLimit = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFrame === 'week') {
      dateLimit = new Date(now);
      dateLimit.setDate(now.getDate() - 7);
    }

    // For each repository, process pull requests
    for (const repo of repositories) {
      // Process both direct repos and track contributions to parent repos
      const repoOwner = repo.fork && repo.parentRepo ? repo.parentRepo.owner : orgName;
      const repoName = repo.fork && repo.parentRepo ? repo.parentRepo.name : repo.name;
      
      try {
        // Fetch all pull requests for this repo
        const { data: pulls } = await octokit.pulls.list({
          owner: repoOwner,
          repo: repoName,
          state: 'all',
          per_page: 100
        });

        // For each pull request, get the detailed stats
        for (const pr of pulls) {
          // Apply timeframe filter
          if (dateLimit && new Date(pr.created_at) < dateLimit) continue;
          
          const author = pr.user?.login;
          if (!author) continue;
          
          // Get or create user stats entry
          let userStats = userStatsMap.get(author);
          if (!userStats) {
            userStats = {
              username: author,
              name: '', // Will be populated from profile if available
              avatarUrl: pr.user?.avatar_url || '',
              totalLinesOfCode: 0,
              mergedPullRequests: 0,
              openPullRequests: 0,
              devCoins: 0
            };
            userStatsMap.set(author, userStats);
          }
          
          try {
            // Get detailed PR info
            const { data: prDetails } = await octokit.pulls.get({
              owner: repoOwner,
              repo: repoName,
              pull_number: pr.number
            });
            
            // Update statistics
            userStats.totalLinesOfCode += (prDetails.additions || 0) + (prDetails.deletions || 0);
            
            // Update PR counts
            if (pr.state === 'open') {
              userStats.openPullRequests++;
            } else if (prDetails.merged) {
              userStats.mergedPullRequests++;
            }
            
            // Calculate DevCoins based on contributions
            userStats.devCoins += calculateDevCoins(prDetails);
            
          } catch (error) {
            console.error(`Error processing PR details for ${pr.number}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error fetching PRs for ${repoName}:`, error);
      }
    }
    
    // Try to get additional user info from profiles
    const userStatsArray = Array.from(userStatsMap.values());
    for (const stats of userStatsArray) {
      try {
        const { data: userProfile } = await octokit.users.getByUsername({
          username: stats.username
        });
        
        stats.name = userProfile.name || userProfile.login;
        if (!stats.avatarUrl && userProfile.avatar_url) {
          stats.avatarUrl = userProfile.avatar_url;
        }
      } catch (error) {
        console.error(`Error fetching profile for ${stats.username}:`, error);
      }
    }
    
    const sortedStats = userStatsArray.sort((a, b) => b.devCoins - a.devCoins);
    
    // Cache the results
    const cacheKey = timeFrame === 'all' 
      ? CACHE_KEYS.LEADERBOARD_ALL 
      : timeFrame === 'month' 
        ? CACHE_KEYS.LEADERBOARD_MONTH 
        : CACHE_KEYS.LEADERBOARD_WEEK;
    cacheService.set(cacheKey, sortedStats, CACHE_EXPIRATION.LEADERBOARD);
    
    return sortedStats;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};

/**
 * Fetches all organization members and combines them with their team memberships
 */
export const fetchOrganizationMembers = async (): Promise<GithubMember[]> => {
  // Try to get data from cache
  const cachedMembers = cacheService.get<GithubMember[]>(CACHE_KEYS.ORGANIZATION_MEMBERS);
  if (cachedMembers) {
    console.log('Using cached organization members data');
    return cachedMembers;
  }
  
  console.log('Fetching fresh organization members data...');
  try {
    const orgName = import.meta.env.VITE_GITHUB_ORG || 'NST-SDC';
    console.log(`Fetching members from organization: ${orgName}`);

    // Check if token is configured
    if (!import.meta.env.VITE_GITHUB_TOKEN) {
      throw new Error('GitHub token not configured in environment variables');
    }

    // First, get all members of the organization
    const membersMap = new Map<string, GithubMember>();
    let page = 1;
    let hasMore = true;
    
    // Fetch all organization members with pagination
    while (hasMore) {
      try {
        const { data: members } = await octokit.orgs.listMembers({
          org: orgName,
          per_page: 100,
          page
        });
        
        if (members.length === 0) {
          hasMore = false;
        } else {
          // Process each member
          for (const member of members) {
            if (!membersMap.has(member.login)) {
              membersMap.set(member.login, {
                id: member.id,
                username: member.login,
                name: '',
                avatarUrl: member.avatar_url,
                bio: '',
                email: '',
                company: '',
                location: '',
                blog: '',
                twitterUsername: '',
                teamNames: [],
                role: 'member',
                contributions: {
                  totalLinesOfCode: 0,
                  mergedPullRequests: 0,
                  openPullRequests: 0,
                },
                devCoins: 0
              });
            }
          }
          page++;
        }
      } catch (error) {
        console.error(`Error fetching org members page ${page}:`, error);
        hasMore = false;
      }
    }

    // Then fetch outside collaborators as well (they aren't members but contribute)
    try {
      const { data: outsideCollaborators } = await octokit.orgs.listOutsideCollaborators({
        org: orgName,
        per_page: 100
      });
      
      for (const collaborator of outsideCollaborators) {
        if (!membersMap.has(collaborator.login)) {
          membersMap.set(collaborator.login, {
            id: collaborator.id,
            username: collaborator.login,
            name: '',
            avatarUrl: collaborator.avatar_url,
            bio: '',
            email: '',
            company: '',
            location: '',
            blog: '',
            twitterUsername: '',
            teamNames: [],
            role: 'outside',
            contributions: {
              totalLinesOfCode: 0,
              mergedPullRequests: 0,
              openPullRequests: 0,
            },
            devCoins: 0
          });
        }
      }
    } catch (error) {
      console.warn('Error fetching outside collaborators:', error);
    }

    // Now get all teams in the organization
    let teams: any[] = [];
    page = 1;
    hasMore = true;
    
    while (hasMore) {
      try {
        const { data: teamsPage } = await octokit.teams.list({
          org: orgName,
          per_page: 100,
          page
        });
        
        if (teamsPage.length === 0) {
          hasMore = false;
        } else {
          teams = teams.concat(teamsPage);
          page++;
        }
      } catch (error) {
        console.error(`Error fetching teams page ${page}:`, error);
        hasMore = false;
      }
    }
    
    console.log(`Found ${teams.length} teams in the organization`);

    // For each team, get its members
    for (const team of teams) {
      try {
        const { data: teamMembers } = await octokit.teams.listMembersInOrg({
          org: orgName,
          team_slug: team.slug,
          per_page: 100
        });
        
        // Add team name to each member's teamNames array
        for (const member of teamMembers) {
          if (membersMap.has(member.login)) {
            membersMap.get(member.login)!.teamNames.push(team.name);
          } else {
            // If we find a team member not already in our list, add them
            membersMap.set(member.login, {
              id: member.id,
              username: member.login,
              name: '',
              avatarUrl: member.avatar_url,
              bio: '',
              email: '',
              company: '',
              location: '',
              blog: '',
              twitterUsername: '',
              teamNames: [team.name],
              role: 'member',
              contributions: {
                totalLinesOfCode: 0,
                mergedPullRequests: 0,
                openPullRequests: 0,
              },
              devCoins: 0
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching members for team ${team.name}:`, error);
      }
    }
    
    // Get admins of the organization
    try {
      const { data: admins } = await octokit.orgs.listMembers({
        org: orgName,
        role: 'admin',
        per_page: 100
      });
      
      // Mark admins appropriately
      for (const admin of admins) {
        if (membersMap.has(admin.login)) {
          membersMap.get(admin.login)!.role = 'admin';
        }
      }
    } catch (error) {
      console.warn('Error fetching organization admins:', error);
    }
    
    // Fetch detailed information for each member
    const members = Array.from(membersMap.values());
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      try {
        // Throttle requests to avoid rate limiting
        if (i > 0 && i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const { data: user } = await octokit.users.getByUsername({
          username: member.username
        });
        
        member.name = user.name || user.login;
        member.bio = user.bio || '';
        member.email = user.email || '';
        member.company = user.company || '';
        member.location = user.location || '';
        member.blog = user.blog || '';
        member.twitterUsername = user.twitter_username || '';
      } catch (error) {
        console.warn(`Error fetching details for user ${member.username}:`, error);
      }
    }
    
    // Get contribution data for all members
    const contributionData = await fetchLeaderboardData();
    
    // Merge contribution data with member profiles
    for (const member of members) {
      const userStats = contributionData.find(stat => 
        stat.username.toLowerCase() === member.username.toLowerCase()
      );
      
      if (userStats) {
        member.contributions = {
          totalLinesOfCode: userStats.totalLinesOfCode,
          mergedPullRequests: userStats.mergedPullRequests,
          openPullRequests: userStats.openPullRequests,
        };
        member.devCoins = userStats.devCoins;
      }
    }
    
    const sortedMembers = members.sort((a, b) => b.devCoins - a.devCoins);
    
    // Cache the results
    cacheService.set(CACHE_KEYS.ORGANIZATION_MEMBERS, sortedMembers, CACHE_EXPIRATION.ORGANIZATION_MEMBERS);
    
    return sortedMembers;
  } catch (error) {
    console.error('Error fetching organization members:', error);
    return [];
  }
};

// Calculate DevCoins based on PR stats
const calculateDevCoins = (pr: any): number => {
  let coins = 0;
  
  // Base points for creating a PR
  coins += 10;
  
  // Points for code contribution (1 coin per 10 lines changed)
  const linesChanged = (pr.additions || 0) + (pr.deletions || 0);
  coins += Math.floor(linesChanged / 10);
  
  // Bonus for merged PRs
  if (pr.merged) {
    coins += 15;
    
    // Additional bonus based on PR size
    if (linesChanged > 500) coins += 20;
    else if (linesChanged > 200) coins += 10;
    else if (linesChanged > 50) coins += 5;
  }
  
  return coins;
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
