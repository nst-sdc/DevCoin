import React, { useState } from 'react';
import { Plus, Github, ExternalLink, FileCode, Users, ChevronDown, Trophy } from 'lucide-react';
import ContributionModal from '../components/ContributionModal';
import { mockMembers } from '../types';

const PROJECTS = [
  {
    id: 'p1',
    name: 'Dev Club Dashboard',
    description: 'Track contributions and manage Dev Club activities',
    repo: 'NST-SDC/dev-club-dashboard',
    coins: 50,
  },
  {
    id: 'p2',
    name: 'Student Portal',
    description: 'Centralized platform for student services',
    repo: 'NST-SDC/student-portal',
    coins: 40,
  },
  {
    id: 'p3',
    name: 'Event Manager',
    description: 'Manage and track college events and workshops',
    repo: 'NST-SDC/event-manager',
    coins: 30,
  },
];

export default function CoinsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dev Coins Dashboard</h1>
          <p className="mt-2 text-gray-600">Track and manage development contributions across projects</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Contribution
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-100">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-t-lg flex items-center"
              >
                <Trophy className="h-5 w-5 mr-2 text-indigo-600" />
                <div>
                  <div className="font-medium">Regular Contribution</div>
                  <div className="text-sm text-gray-500">Add project-related work</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowOtherForm(true);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-b-lg flex items-center"
              >
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                <div>
                  <div className="font-medium">Other Contribution</div>
                  <div className="text-sm text-gray-500">Add community activities</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Active Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Github className="h-6 w-6 mr-2 text-indigo-600" />
              Active Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PROJECTS.map(project => (
                <div key={project.id} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-100 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-2.5 py-1 rounded-md">
                      {project.coins} DevCoins
                    </span>
                  </div>
                  <a
                    href={`https://github.com/${project.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    View Repository
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Other Contributions Form */}
          {showOtherForm && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-indigo-600" />
                Submit Other Contribution
              </h2>
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSf4z5274AkUuqcPovMZSwvP8gYMFZ-HStOTnBp3fIh6HzFjHA/viewform?embedded=true"
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                className="mt-4"
              >
                Loading form...
              </iframe>
            </div>
          )}
        </div>

        {/* Right Column: Dev Coins Policy */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-indigo-600" />
              Dev Coins Policy
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-3 flex items-center">
                  <FileCode className="h-5 w-5 mr-2 text-indigo-600" />
                  Project Contributions
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between items-center">
                    <span>Pull Request (Merged)</span>
                    <span className="font-medium text-indigo-600">50 DevCoins</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Bug Fix</span>
                    <span className="font-medium text-indigo-600">30 DevCoins</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Documentation</span>
                    <span className="font-medium text-indigo-600">20 DevCoins</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Code Review</span>
                    <span className="font-medium text-indigo-600">15 DevCoins</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-medium mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Community Contributions
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between items-center">
                    <span>Workshop Hosting</span>
                    <span className="font-medium text-indigo-600">100 DevCoins</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Event Organization</span>
                    <span className="font-medium text-indigo-600">80 DevCoins</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Mentoring Sessions</span>
                    <span className="font-medium text-indigo-600">60 DevCoins</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Technical Blog</span>
                    <span className="font-medium text-indigo-600">40 DevCoins</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={mockMembers}
      />
    </div>
  );
}