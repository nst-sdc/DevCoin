import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Users, GitPullRequest, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { makeAdmin, approveContribution } from '../../services/admin';
import type { User } from '../../types/auth';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingContributions, setPendingContributions] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      navigate('/');
      return;
    }

    // Fetch pending contributions and users
    // Implementation details...
  }, [user, navigate]);

  const handleMakeAdmin = async (userId: string) => {
    try {
      await makeAdmin(userId);
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleApproveContribution = async (contributionId: string) => {
    try {
      await approveContribution(contributionId);
      toast.success('Contribution approved successfully');
    } catch (error) {
      toast.error('Failed to approve contribution');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <span className="text-gray-600">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Contributions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <GitPullRequest className="h-5 w-5 mr-2 text-indigo-600" />
            Pending Contributions
          </h2>
          {/* Contribution list implementation */}
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600" />
            User Management
          </h2>
          {/* User management implementation */}
        </div>

        {/* Settings */}
        {user?.role === 'super_admin' && (
          <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-indigo-600" />
              System Settings
            </h2>
            {/* Super admin settings implementation */}
          </div>
        )}
      </div>
    </div>
  );
}