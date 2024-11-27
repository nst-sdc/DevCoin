import React, { useState } from 'react';
import { Plus, Search, Github, ExternalLink, FileCode, Users } from 'lucide-react';
import { Member, mockMembers } from '../types';
import ContributionModal from '../components/ContributionModal';
import MemberContributions from '../components/MemberContributions';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOtherForm, setShowOtherForm] = useState(false);

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dev Coins Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Contribution
        </button>
      </div>

      {/* Policy Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Dev Coins Policy</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <FileCode className="h-5 w-5 mr-2 text-indigo-600" />
              Project Contributions
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Pull Request (Merged): 50 DevCoins</li>
              <li>• Bug Fix: 30 DevCoins</li>
              <li>• Documentation: 20 DevCoins</li>
              <li>• Code Review: 15 DevCoins</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Community Contributions
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Workshop Hosting: 100 DevCoins</li>
              <li>• Event Organization: 80 DevCoins</li>
              <li>• Mentoring Sessions: 60 DevCoins</li>
              <li>• Technical Blog: 40 DevCoins</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contribution Options */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Project Contributions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
          <div className="space-y-4">
            {PROJECTS.map(project => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {project.coins} DevCoins
                  </span>
                </div>
                <a
                  href={`https://github.com/${project.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-600 hover:text-indigo-600 mt-2"
                >
                  <Github className="h-4 w-4 mr-1" />
                  View Project
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Other Contributions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Other Contributions</h2>
          <p className="text-gray-600 mb-4">
            Have you contributed through workshops, events, or other activities? Submit your contribution details using our form.
          </p>
          <button
            onClick={() => setShowOtherForm(!showOtherForm)}
            className="w-full bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Submit Other Contribution
          </button>
          {showOtherForm && (
            <div className="mt-4">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSf4z5274AkUuqcPovMZSwvP8gYMFZ-HStOTnBp3fIh6HzFjHA/viewform?embedded=true"
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
              >
                Loading form...
              </iframe>
            </div>
          )}
        </div>
      </div>

      {/* Members List */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search members..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {member.devCoins} DevCoins
                    </span>
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(member)}
                className="mt-4 w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Contributions
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <MemberContributions
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      <ContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={mockMembers}
      />
    </div>
  );
}