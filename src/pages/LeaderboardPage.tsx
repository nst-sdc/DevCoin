import React, { useState, useEffect } from 'react';
import { Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LeaderboardPage() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) {
        console.error('Error fetching leaderboard data:', error);
      } else if (data) {
        setMembers(data);
      }
    }
    fetchMembers();
  }, []);

  const sortedMembers = [...members].sort((a, b) => b.dev_coins - a.dev_coins);

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dev Club Leaderboard</h1>
      </div>
      <div className="max-w-3xl mx-auto">
        {sortedMembers.map((member, index) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-md mb-4 translate-y-0 opacity-100 transition-all duration-300"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="p-6 flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 text-center">
                {index === 0 && <Trophy className="h-8 w-8 text-yellow-400 mx-auto" />}
                {index === 1 && <Trophy className="h-8 w-8 text-gray-400 mx-auto" />}
                {index === 2 && <Trophy className="h-8 w-8 text-amber-700 mx-auto" />}
                {index > 2 && (
                  <span className="text-xl font-bold text-gray-500">#{index + 1}</span>
                )}
              </div>
              
              <img
                src={member.avatar_url}
                alt={member.full_name}
                className="h-12 w-12 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{member.full_name}</h3>
                <p className="text-sm text-gray-500">{member.github_username || 'Developer'}</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {member.dev_coins}
                </div>
                <div className="text-sm text-gray-500">DevCoins</div>
              </div>
              
              <div className="flex-shrink-0 w-8">
                {index === 0 ? (
                  <div className="text-green-500">
                    <ArrowUp className="h-5 w-5" />
                  </div>
                ) : index === sortedMembers.length - 1 ? (
                  <div className="text-red-500">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}