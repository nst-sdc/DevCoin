import React from 'react';
import { Github, Award } from 'lucide-react';
import type { Member } from '../types';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-400 bg-opacity-15 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src={member.avatar}
            alt={member.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-400">{member.name}</h3>
            <p className="text-sm text-gray-400">{member.role}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 text-yellow-400">
              <Award className="h-5 w-5" />
              <span className="font-semibold">{member.devCoins}</span>
            </div>
            <a
              href={`https://github.com/${member.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-gray-400 hover:text-gray-600"
              onClick={e => e.stopPropagation()}
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}