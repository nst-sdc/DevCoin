import React from 'react';
import { X, Github, Calendar, Award } from 'lucide-react';
import type { Member } from '../types';

interface MemberContributionsProps {
  member: Member;
  onClose: () => void;
}

export default function MemberContributions({ member, onClose }: MemberContributionsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={member.avatar}
              alt={member.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-gray-500">{member.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-indigo-600 font-semibold">Total Dev Coins</div>
            <div className="text-2xl font-bold">{member.devCoins}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 font-semibold">Pull Requests</div>
            <div className="text-2xl font-bold">
              {member.contributions.filter(c => c.type === 'PR').length}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-purple-600 font-semibold">Events</div>
            <div className="text-2xl font-bold">
              {member.contributions.filter(c => c.type === 'EVENT').length}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {member.contributions.map(contribution => (
            <div
              key={contribution.id}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium
                      ${contribution.type === 'PR' ? 'bg-green-100 text-green-800' :
                        contribution.type === 'COLLAB' ? 'bg-blue-100 text-blue-800' :
                        contribution.type === 'EVENT' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {contribution.type}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {contribution.date}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{contribution.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-600">
                    +{contribution.coins}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={`https://github.com/${member.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Github className="h-5 w-5" />
            <span>View GitHub Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}