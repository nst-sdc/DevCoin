import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Github, Linkedin, Mail, Award, Calendar, Edit2, Lock } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { updateUserProfile } from '../services/localStore';
import type { User } from '../types/auth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    await updateUserProfile(user.id, updatedData);
  };

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative h-32 bg-gradient-to-r from-teal-200 to-emerald-200">
          {/* Profile Actions */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-90 rounded-md text-sm font-medium text-gray-700 hover:bg-opacity-100 transition-all shadow-md"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-90 rounded-md text-sm font-medium text-gray-700 hover:bg-opacity-100 transition-all shadow-md"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
          {/* Profile picture overlapping the banner */}
          <img
            src={user.avatar || `https://github.com/${user.githubUsername}.png`}
            alt={user.name}
            className="absolute bottom-0 left-8 transform translate-y-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">{user.name}</h1>
              <p className="text-gray-600 capitalize">{user.role}</p>
              {user.bio && <p className="mt-2 text-gray-600">{user.bio}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-lg">{user.devCoins} DevCoins</span>
            </div>
          </div>

          {/* Location and Company */}
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
            {user.location && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">📍</span>
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🏢</span>
                <span>{user.company}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <span className="text-gray-100">{user.email}</span>
            </div>
            {user.githubUsername && (
              <div className="flex items-center space-x-3">
                <Github className="h-5 w-5 text-gray-500" />
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-100 hover:text-indigo-500"
                >
                  @{user.githubUsername}
                </a>
              </div>
            )}
            {user.linkedin && (
              <div className="flex items-center space-x-3">
                <Linkedin className="h-5 w-5 text-gray-500" />
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contributions & Activity */}
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contributions & Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Total Contributions</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Pull Requests</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Events Attended</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Member Since</span>
              <span className="font-semibold">January 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateProfile}
      />
      
      <ChangePasswordModal
        user={user}
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
