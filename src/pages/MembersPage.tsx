import React, { useState, useEffect } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import MemberCard from '../components/MemberCard';
import MemberModal from '../components/MemberModal';
import { mockMembers } from '../types';
import { fetchOrganizationMembers, GithubMember } from '../services/github';

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [members, setMembers] = useState<GithubMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch GitHub organization members
        const orgMembers = await fetchOrganizationMembers();
        setMembers(orgMembers);
      } catch (err: any) {
        console.error('Error loading GitHub members:', err);
        setError(err.message || 'Failed to load members from GitHub');
        // Fall back to mock members if GitHub fetch fails
        setMembers(mockMembers.map(member => ({
          id: parseInt(member.id),
          username: member.github,
          name: member.name,
          avatarUrl: member.avatar,
          bio: '',
          email: member.email || '',
          company: '',
          location: '',
          blog: '',
          twitterUsername: '',
          teamNames: [member.role],
          role: 'member',
          contributions: {
            totalLinesOfCode: 0,
            mergedPullRequests: 0,
            openPullRequests: 0,
          },
          devCoins: member.devCoins
        })));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMembers();
  }, []);

  // Filter by search term and role
  const filteredMembers = members.filter(member => {
    const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      member.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return nameMatch;
    
    // Filter by team/role
    const roleMatch = member.teamNames.some(team => 
      team.toLowerCase().includes(filter.toLowerCase())
    );
    
    return nameMatch && roleMatch;
  });

  // Get unique team names for the filter dropdown
  const teamOptions = Array.from(
    new Set(
      members.flatMap(member => member.teamNames)
    )
  ).sort();

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dev Club Members</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Teams</option>
              {teamOptions.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-400">Loading members...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Showing mock data instead.</p>
        </div>
      )}

      {!isLoading && members.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl text-gray-300 mb-2">No members found</p>
          <p className="text-gray-400">
            Try checking your GitHub token and organization settings
          </p>
        </div>
      )}

      {!isLoading && filteredMembers.length === 0 && members.length > 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-300">No results match your search</p>
          <p className="text-gray-400 mt-2">Try a different search term or filter</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div 
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="bg-gray-400 bg-opacity-15 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer hover:bg-gray-400 hover:bg-opacity-20"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={member.avatarUrl || `https://github.com/identicons/${member.username}`}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">@{member.username}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {member.teamNames.map((team, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-indigo-500 bg-opacity-20 text-indigo-200"
                      >
                        {team}
                      </span>
                    ))}
                    {member.role === 'admin' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-500 bg-opacity-20 text-amber-200">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                  <div className="text-xl font-bold text-white">
                    {member.contributions.totalLinesOfCode.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Lines of Code</div>
                </div>
                <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                  <div className="text-xl font-bold text-white">
                    {member.contributions.mergedPullRequests}
                  </div>
                  <div className="text-xs text-gray-400">PRs Merged</div>
                </div>
                <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                  <div className="text-xl font-bold text-indigo-400">
                    {member.devCoins}
                  </div>
                  <div className="text-xs text-gray-400">DevCoins</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-white">{selectedMember.name}</h3>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <img
                  src={selectedMember.avatarUrl || `https://github.com/identicons/${selectedMember.username}`}
                  alt={selectedMember.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg text-white">@{selectedMember.username}</h4>
                    <a 
                      href={`https://github.com/${selectedMember.username}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View on GitHub
                    </a>
                  </div>
                  
                  {selectedMember.email && (
                    <p className="text-sm text-gray-300">{selectedMember.email}</p>
                  )}
                  
                  {selectedMember.location && (
                    <p className="text-sm text-gray-400">{selectedMember.location}</p>
                  )}
                </div>
              </div>
              
              {selectedMember.bio && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-300">Bio</h4>
                  <p className="text-gray-400 mt-1">{selectedMember.bio}</p>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-300">Teams</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMember.teamNames.map((team: string, i: number) => (
                    <span 
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-indigo-500 bg-opacity-20 text-indigo-200"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">
                    {selectedMember.contributions.totalLinesOfCode.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Lines of Code</div>
                </div>
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">
                    {selectedMember.contributions.mergedPullRequests}
                  </div>
                  <div className="text-xs text-gray-400">PRs Merged</div>
                </div>
                <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedMember.contributions.openPullRequests}
                  </div>
                  <div className="text-xs text-gray-400">PRs Open</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-xl font-bold text-indigo-400">{selectedMember.devCoins} DevCoins</h4>
                <p className="text-gray-400 text-sm mt-1">
                  DevCoins are earned through contributions to the organization's repositories
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}