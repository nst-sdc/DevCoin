import React from 'react';
import { Star, GitBranch, Clock, Code } from 'lucide-react';
import type { Repository } from '../../services/github';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Repository;
  onAssign?: () => void;
  isAssigned?: boolean;
}

export default function ProjectCard({ project, onAssign, isAssigned }: ProjectCardProps) {
  return (
    <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white hover:text-indigo-600">
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            </h3>
            <p className="text-gray-200 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 mr-1" />
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <GitBranch className="h-4 w-4 mr-1" />
              <span>{project.openIssues}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-emerald-500 mb-4">
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-1" />
            <span>{project.language}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(project.updatedAt))} ago</span>
          </div>
        </div>

        {project.pullRequests.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-orange-600 mb-2">Recent Pull Requests</h4>
            <div className="space-y-2">
              {project.pullRequests.slice(0, 3).map(pr => (
                <a
                  key={pr.id}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-cyan-800 rounded p-2 -mx-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-200">{pr.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pr.status === 'merged' ? 'bg-purple-100 text-purple-800' :
                      pr.status === 'open' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pr.status}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-500 mt-1">
                    by {pr.author} • {formatDistanceToNow(new Date(pr.createdAt))} ago
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {onAssign && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={onAssign}
              disabled={isAssigned}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                isAssigned
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {isAssigned ? 'Already Assigned' : 'Get Assigned'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}