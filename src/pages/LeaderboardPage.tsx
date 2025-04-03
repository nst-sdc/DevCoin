import React, { useState, useEffect } from 'react';
import { Trophy, ArrowUp, ArrowDown, Code, GitPullRequest, GitPullRequestDraft, GitCommit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchLeaderboardData, UserStats } from '../services/github';

export default function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState<'all' | 'month' | 'week'>('all');
  const [animateRank, setAnimateRank] = useState(false);
  const [members, setMembers] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAnimateRank(true);
    const timer = setTimeout(() => setAnimateRank(false), 500);
    return () => clearTimeout(timer);
  }, [timeFrame]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch GitHub contribution data
        const githubData = await fetchLeaderboardData(timeFrame);
        
        // Get additional profile data from Supabase if needed
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) {
          console.error('Error fetching profile data:', error);
        }
        
        // Merge GitHub data with profile data when possible
        if (profileData) {
          githubData.forEach(member => {
            const profile = profileData.find(p => 
              p.github_username && 
              p.github_username.toLowerCase() === member.username.toLowerCase()
            );
            
            if (profile) {
              member.name = profile.full_name || profile.name || member.name;
              member.avatarUrl = profile.avatar_url || member.avatarUrl;
            }
          });
        }
        
        setMembers(githubData);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data. Please check your GitHub token.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [timeFrame]);

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Dev Club Leaderboard</h1>
        <div className="flex justify-center space-x-4 mb-6">
          <TimeFrameButton
            active={timeFrame === 'all'}
            onClick={() => setTimeFrame('all')}
          >
            All Time
          </TimeFrameButton>
          <TimeFrameButton
            active={timeFrame === 'month'}
            onClick={() => setTimeFrame('month')}
          >
            This Month
          </TimeFrameButton>
          <TimeFrameButton
            active={timeFrame === 'week'}
            onClick={() => setTimeFrame('week')}
          >
            This Week
          </TimeFrameButton>
        </div>
        <p className="text-sm text-zinc-400">Showing lines of code, commits, and pull requests from GitHub contributions</p>
      </div>

      {isLoading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Make sure your GitHub token is configured in the .env file with the correct permissions.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="max-w-4xl mx-auto">
          {members.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">No data found. Try adding GitHub tokens with proper permissions.</div>
          ) : (
            members.map((member, index) => (
              <div
                key={member.username}
                className={`bg-gray-400 bg-opacity-15 rounded-xl shadow-md mb-4 transform transition-all duration-300 ${
                  animateRank ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 text-center">
                    {index === 0 && <Trophy className="h-8 w-8 text-yellow-400 mx-auto" />}
                    {index === 1 && <Trophy className="h-8 w-8 text-gray-400 mx-auto" />}
                    {index === 2 && <Trophy className="h-8 w-8 text-amber-700 mx-auto" />}
                    {index > 2 && (
                      <span className="text-xl font-bold text-lime-500">#{index + 1}</span>
                    )}
                  </div>
                  
                  <img
                    src={member.avatarUrl || 'https://github.com/identicons/' + member.username}
                    alt={member.name || member.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {member.name || member.username}
                    </h3>
                    <div className="text-sm text-zinc-400 flex flex-wrap gap-3 mt-1">
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        <span>{member.totalLinesOfCode.toLocaleString()} lines</span>
                      </div>
                      
                      <div className="flex items-center">
                        <GitCommit className="h-4 w-4 mr-1 text-blue-400" />
                        <span>{member.totalCommits} commits</span>
                      </div>
                      
                      <div className="flex items-center">
                        <GitPullRequest className="h-4 w-4 mr-1 text-green-500" />
                        <span>{member.mergedPullRequests} merged</span>
                      </div>
                      
                      <div className="flex items-center">
                        <GitPullRequestDraft className="h-4 w-4 mr-1 text-orange-500" />
                        <span>{member.openPullRequests} open</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {member.devCoins}
                    </div>
                    <div className="text-sm text-gray-500">DevCoins</div>
                  </div>
                  
                  <div className="flex-shrink-0 w-8">
                    {index === 0 ? (
                      <div className="text-green-500">
                        <ArrowUp className="h-5 w-5" />
                      </div>
                    ) : index === members.length - 1 ? (
                      <div className="text-red-500">
                        <ArrowDown className="h-5 w-5" />
                      </div>
                    ) : null}
                  </div>
                </div>
                
                {/* Expanded contribution details */}
                <div className="px-6 pb-4 pt-2 grid grid-cols-4 gap-2 text-center border-t border-gray-600 border-opacity-40 mt-2">
                  <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                    <div className="text-sm font-bold text-white">{member.totalLinesOfCode.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Total Lines</div>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                    <div className="text-sm font-bold text-blue-400">{member.totalCommits}</div>
                    <div className="text-xs text-gray-400">Commits</div>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                    <div className="text-sm font-bold text-blue-200">{member.commitLinesOfCode.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Commit Lines</div>
                  </div>
                  
                  <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                    <div className="text-sm font-bold text-green-400">
                      {member.mergedPullRequests + member.openPullRequests}
                    </div>
                    <div className="text-xs text-gray-400">Total PRs</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TimeFrameButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}