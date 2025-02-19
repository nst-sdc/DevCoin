import React, { useState } from 'react';
import { X, Upload, RefreshCw } from 'lucide-react';
import { User } from '../types/auth';
import { toast } from 'react-toastify';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedData: Partial<User>) => Promise<void>;
}

export default function EditProfileModal({ user, isOpen, onClose, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    github: user.github,
    linkedin: user.linkedin || '',
    email: user.email,
    avatar: user.avatar || `https://avatars.githubusercontent.com/${user.github}`
  });
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar || `https://avatars.githubusercontent.com/${user.github}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update avatar preview when GitHub username changes
    if (name === 'github') {
      const newAvatarUrl = `https://avatars.githubusercontent.com/${value}`;
      setPreviewAvatar(newAvatarUrl);
      setFormData(prev => ({ ...prev, avatar: newAvatarUrl }));
    }
    // Update avatar preview when direct avatar URL changes
    if (name === 'avatar') {
      setPreviewAvatar(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
      toast.success('Profile updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarError = () => {
    setPreviewAvatar(`https://ui-avatars.com/api/?name=${formData.name.replace(/\s+/g, '+')}&background=random`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl text-white font-semibold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Preview and Controls */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={previewAvatar}
                alt={formData.name}
                onError={handleAvatarError}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="Custom avatar URL"
                  className="w-full px-3 py-2 text-sm text-white bg-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const githubAvatar = `https://avatars.githubusercontent.com/${formData.github}`;
                    setPreviewAvatar(githubAvatar);
                    setFormData(prev => ({ ...prev, avatar: githubAvatar }));
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  title="Reset to GitHub avatar"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-indigo-100">
                Enter a custom avatar URL or use your GitHub avatar
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-indigo-100 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-white bg-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-white bg-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium text-indigo-100 mb-1">
              GitHub Username
            </label>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-white bg-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-indigo-100 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 text-white bg-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-indigo-100 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}
              `}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
