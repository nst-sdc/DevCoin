import React from 'react';
import { X, Github, Mail, Award } from 'lucide-react';
import type { Member } from '../types';

interface MemberModalProps {
  member: Member;
  onClose: () => void;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Member Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-start space-x-6">
          <img
            src={member.avatar}
            alt={member.name}
            className="h-32 w-32 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-lg text-gray-600 mb-4">{member.role}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <span className="text-indigo-600 font-semibold">Dev Coins</span>
                </div>
                <div className="text-2xl font-bold mt-1">{member.devCoins}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Github className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600 font-semibold">Contributions</span>
                </div>
                <div className="text-2xl font-bold mt-1">
                  {member.contributions.length}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Github className="h-5 w-5" />
                <span>@{member.github}</span>
              </a>
              
              <a
                href={`mailto:${member.github}@example.com`}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Mail className="h-5 w-5" />
                <span>{member.github}@example.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4">Recent Contributions</h4>
          <div className="space-y-4">
            {member.contributions.slice(0, 3).map(contribution => (
              <div
                key={contribution.id}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <span className={`px-2 py-1 rounded text-sm font-medium
                    ${contribution.type === 'PR' ? 'bg-green-100 text-green-800' :
                      contribution.type === 'COLLAB' ? 'bg-blue-100 text-blue-800' :
                      contribution.type === 'EVENT' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {contribution.type}
                  </span>
                  <p className="mt-2">{contribution.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-600">
                    +{contribution.coins}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}