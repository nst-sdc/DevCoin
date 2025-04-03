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
  totalCommits: number;
  commitLinesOfCode: number;
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
    totalCommits: number;
    commitLinesOfCode: number;
  };
  devCoins: number;
}

export interface CommitData {
  author: string;
  sha: string;
  message: string;
  date: string;
  url: string;
  additions: number;
  deletions: number;
  repository: string;
}

// Fetch commit data for a user across all repositories
export const fetchUserCommits = async (
  username: string,
  timeFrame: 'all' | 'month' | 'week' = 'all'
): Promise<CommitData[]> => {
  try {
    const orgName = import.meta.env.VITE_GITHUB_ORG || 'NST-SDC';
    console.log(`Fetching commits for user ${username} in ${orgName}`);

    // Calculate date limit based on timeframe
    let since: string | undefined = undefined;
    if (timeFrame !== 'all') {
      const now = new Date();
      if (timeFrame === 'month') {
        since = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();
      } else if (timeFrame === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        since = weekAgo.toISOString();
      }
    }

    // Get repositories
    const repositories = await fetchRepositories();
    const commits: CommitData[] = [];

    // For each repository, get commits by the user
    for (const repo of repositories) {
      // Process both direct repos and forked repos
      const repoOwner = repo.fork && repo.parentRepo ? repo.parentRepo.owner : orgName;
      const repoName = repo.fork && repo.parentRepo ? repo.parentRepo.name : repo.name;

      try {
        // Search for commits by the author
        const params: any = {
          owner: repoOwner,
          repo: repoName,
          author: username,
          per_page: 100
        };

        if (since) {
          params.since = since;
        }

        const { data: repoCommits } = await octokit.repos.listCommits(params);

        // Get detailed commit data for each commit
        for (const commit of repoCommits) {
          try {
            // Limit API calls to avoid rate limiting - process up to 20 commits per repo
            if (commits.length > 20) break;

            const { data: commitDetail } = await octokit.repos.getCommit({
              owner: repoOwner,
              repo: repoName,
              ref: commit.sha
            });

            // Calculate additions and deletions across all files
            const additions = commitDetail.files?.reduce((sum, file) => sum + (file.additions || 0), 0) || 0;
            const deletions = commitDetail.files?.reduce((sum, file) => sum + (file.deletions || 0), 0) || 0;

            commits.push({
              author: username,
              sha: commit.sha,
              message: commit.commit.message,
              date: commit.commit.author?.date || commit.commit.committer?.date || new Date().toISOString(),
              url: commit.html_url,
              additions,
              deletions,
              repository: repoName
            });
          } catch (error) {
            console.error(`Error fetching commit details for ${commit.sha} in ${repoName}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repoName}:`, error);
      }
    }

    // Sort by date (newest first)
    return commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error(`Error in fetchUserCommits for ${username}:`, error);
    return [];
  }
}

/**
 * Fetches commit history for a repository to analyze lines of code contributed by each author
 * This is especially important for admins who may commit directly without PRs
 */
export const fetchRepositoryCommitHistory = async (
  owner: string,
  repo: string, 
  timeFrame: 'all' | 'month' | 'week' = 'all'
): Promise<Map<string, { commits: number, additions: number, deletions: number }>> => {
  try {
    console.log(`Fetching commit history for ${owner}/${repo}`);
    
    // Calculate date limit based on timeframe
    let since: string | undefined = undefined;
    if (timeFrame !== 'all') {
      const now = new Date();
      if (timeFrame === 'month') {
        since = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();
      } else if (timeFrame === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        since = weekAgo.toISOString();
      }
    }

    // Store author stats
    const authorStats = new Map<string, { commits: number, additions: number, deletions: number }>();
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      try {
        // Fetch commits with pagination
        const params: any = {
          owner,
          repo,
          per_page: 100,
          page
        };

        if (since) {
          params.since = since;
        }

        const { data: commits } = await octokit.repos.listCommits(params);
        
        if (commits.length === 0) {
          hasMore = false;
          break;
        }
        
        // Process each commit
        for (const commit of commits) {
          const author = commit.author?.login || commit.commit.author?.email || 'unknown';
          
          // Skip commits without a valid author
          if (author === 'unknown') continue;
          
          // Get commit details to find additions/deletions
          try {
            const { data: commitDetail } = await octokit.repos.getCommit({
              owner,
              repo,
              ref: commit.sha
            });
            
            // Calculate total additions/deletions
            const additions = commitDetail.files?.reduce((sum, file) => sum + (file.additions || 0), 0) || 0;
            const deletions = commitDetail.files?.reduce((sum, file) => sum + (file.deletions || 0), 0) || 0;
            
            // Update author stats
            if (!authorStats.has(author)) {
              authorStats.set(author, { commits: 0, additions: 0, deletions: 0 });
            }
            
            const stats = authorStats.get(author)!;
            stats.commits++;
            stats.additions += additions;
            stats.deletions += deletions;
          } catch (error) {
            console.error(`Error fetching details for commit ${commit.sha}:`, error);
          }
        }
        
        page++;
        
        // Throttle API calls to avoid rate limiting
        if (page % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error fetching commits for ${owner}/${repo} page ${page}:`, error);
        hasMore = false;
      }
    }
    
    return authorStats;
  } catch (error) {
    console.error(`Error in fetchRepositoryCommitHistory for ${owner}/${repo}:`, error);
    return new Map();
  }
};

/**
 * Fetches admin direct commit contributions across all repositories
 */
export const fetchAdminDirectCommits = async (
  timeFrame: 'all' | 'month' | 'week' = 'all'
): Promise<Map<string, { commits: number, linesOfCode: number }>> => {
  try {
    const orgName = import.meta.env.VITE_GITHUB_ORG || 'NST-SDC';
    
    // Get all repositories
    const repositories = await fetchRepositories();
    
    // Get all admin users
    const adminUsers = new Set<string>();
    
    // Get organization admins
    try {
      const { data: admins } = await octokit.orgs.listMembers({
        org: orgName,
        role: 'admin',
        per_page: 100
      });
      
      admins.forEach(admin => {
        adminUsers.add(admin.login);
      });
      
      console.log(`Found ${adminUsers.size} admins in the organization`);
    } catch (error) {
      console.error('Error fetching organization admins:', error);
    }
    
    // Get repo admins (users with admin access to repos but not org admins)
    for (const repo of repositories) {
      try {
        const { data: collaborators } = await octokit.repos.listCollaborators({
          owner: orgName,
          repo: repo.name,
          per_page: 100
        });
        
        collaborators.forEach(collab => {
          if (collab.permissions?.admin) {
            adminUsers.add(collab.login);
          }
        });
      } catch (error) {
        console.error(`Error fetching collaborators for ${repo.name}:`, error);
      }
    }
    
    console.log(`Total admin users found (org admins + repo admins): ${adminUsers.size}`);
    
    // Store combined admin stats
    const adminStats = new Map<string, { commits: number, linesOfCode: number }>();
    
    // Process each repository
    for (const repo of repositories) {
      const repoOwner = repo.fork && repo.parentRepo ? repo.parentRepo.owner : orgName;
      const repoName = repo.fork && repo.parentRepo ? repo.parentRepo.name : repo.name;
      
      try {
        // Get commit stats for this repo
        const repoCommitStats = await fetchRepositoryCommitHistory(repoOwner, repoName, timeFrame);
        
        // Update admin stats
        for (const [author, stats] of repoCommitStats.entries()) {
          if (!adminStats.has(author)) {
            adminStats.set(author, { commits: 0, linesOfCode: 0 });
          }
          
          const adminStat = adminStats.get(author)!;
          adminStat.commits += stats.commits;
          adminStat.linesOfCode += stats.additions + stats.deletions;
        }
      } catch (error) {
        console.error(`Error processing commit history for ${repoName}:`, error);
      }
    }
    
    return adminStats;
  } catch (error) {
    console.error('Error fetching admin direct commits:', error);
    return new Map();
  }
};

/**
 * Fetches leaderboard data showing users ranked by their GitHub contributions
 * Includes lines of code, merged PRs, and open PRs
 */
export const fetchLeaderboardData = async (timeFrame: 'all' | 'month' | 'week' = 'all'): Promise<UserStats[]> => {
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
              devCoins: 0,
              totalCommits: 0,
              commitLinesOfCode: 0
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

        // Process commits for each contributor we've found
        const contributorNames = Array.from(userStatsMap.keys());
        for (const username of contributorNames) {
          try {
            // Get commits for this user in this repo
            const params: any = {
              owner: repoOwner,
              repo: repoName,
              author: username,
              per_page: 100
            };

            if (dateLimit) {
              params.since = dateLimit.toISOString();
            }

            const { data: commits } = await octokit.repos.listCommits(params);
            
            if (!userStatsMap.has(username)) continue;
            const userStats = userStatsMap.get(username)!;
            
            // Update commit count
            userStats.totalCommits += commits.length;

            // Get detailed commit data for up to 5 recent commits to analyze code changes
            const recentCommits = commits.slice(0, 5);
            for (const commit of recentCommits) {
              try {
                const { data: commitDetail } = await octokit.repos.getCommit({
                  owner: repoOwner,
                  repo: repoName,
                  ref: commit.sha
                });

                // Add lines of code from this commit
                const additions = commitDetail.files?.reduce((sum, file) => sum + (file.additions || 0), 0) || 0;
                const deletions = commitDetail.files?.reduce((sum, file) => sum + (file.deletions || 0), 0) || 0;
                userStats.commitLinesOfCode += (additions + deletions);

                // Add more DevCoins based on commit contributions
                userStats.devCoins += Math.floor((additions + deletions) / 20); // 1 coin per 20 lines
              } catch (error) {
                console.error(`Error fetching commit details for ${commit.sha}:`, error);
              }
            }
          } catch (error) {
            console.error(`Error fetching commits for ${username} in ${repoName}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error fetching PRs for ${repoName}:`, error);
      }
    }
    
    // Now get direct commit contributions, especially important for admins
    // who often commit directly without PRs
    console.log("Fetching admin direct commit contributions...");
    const adminDirectCommits = await fetchAdminDirectCommits(timeFrame);
    
    // Merge admin direct commit data with other contributions
    for (const [username, stats] of adminDirectCommits.entries()) {
      if (!userStatsMap.has(username)) {
        // Create new user stats if we haven't seen this user yet
        userStatsMap.set(username, {
          username,
          name: '', 
          avatarUrl: '',
          totalLinesOfCode: stats.linesOfCode,
          mergedPullRequests: 0,
          openPullRequests: 0,
          devCoins: Math.floor(stats.linesOfCode / 20), // 1 coin per 20 lines
          totalCommits: stats.commits,
          commitLinesOfCode: stats.linesOfCode
        });
      } else {
        // Update existing user stats with direct commit data
        const userStats = userStatsMap.get(username)!;
        
        // Add lines from direct commits that weren't already counted via PR analysis
        const newLinesOfCode = Math.max(0, stats.linesOfCode - userStats.commitLinesOfCode);
        userStats.totalLinesOfCode += newLinesOfCode;
        userStats.commitLinesOfCode = stats.linesOfCode; // Use the more comprehensive count
        
        // Update commit count if admin direct commit analysis found more
        if (stats.commits > userStats.totalCommits) {
          const additionalCommits = stats.commits - userStats.totalCommits;
          userStats.totalCommits = stats.commits;
          userStats.devCoins += additionalCommits * 2; // 2 coins per additional direct commit found
        }
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
    
    return userStatsArray.sort((a, b) => b.devCoins - a.devCoins);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};

/**
 * Fetches all organization members and combines them with their team memberships
 */
export const fetchOrganizationMembers = async (): Promise<GithubMember[]> => {
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
                  totalCommits: 0,
                  commitLinesOfCode: 0
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
              totalCommits: 0,
              commitLinesOfCode: 0
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
                totalCommits: 0,
                commitLinesOfCode: 0
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
    
    // Get contribution data for all members, including direct commit analysis
    console.log("Fetching complete contribution data including direct commits...");
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
          totalCommits: userStats.totalCommits,
          commitLinesOfCode: userStats.commitLinesOfCode
        };
        
        member.devCoins = userStats.devCoins;
      }
    }
    
    return members.sort((a, b) => b.devCoins - a.devCoins);
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