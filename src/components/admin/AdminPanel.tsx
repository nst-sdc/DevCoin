import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Shield, 
  Users, 
  GitPullRequest, 
  Settings, 
  TrendingUp, 
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  RefreshCcw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { makeAdmin, approveContribution } from '../../services/admin';
import type { User } from '../../types/auth';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingContributions, setPendingContributions] = useState([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
      // Refresh contributions list
      setPendingContributions(prev => prev.filter(c => c.id !== contributionId));
    } catch (error) {
      toast.error('Failed to approve contribution');
    }
  };

  const handleRejectContribution = async (contributionId: string) => {
    try {
      // Implement rejection logic
      toast.success('Contribution rejected');
      setPendingContributions(prev => prev.filter(c => c.id !== contributionId));
    } catch (error) {
      toast.error('Failed to reject contribution');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text text-gray-200">Manage contributions, users, and system settings</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span className="text-indigo-700 font-medium">
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
          <button 
            onClick={() => setLoading(true)} 
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">Pending Contributions</p>
              <p className="text-2xl font-bold text-white">{pendingContributions.length}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <GitPullRequest className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-200 text-sm">System Status</p>
              <p className="text-2xl font-bold text-emerald-600">Active</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Contributions */}
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center text-gray-200">
              <GitPullRequest className="h-5 w-5 mr-2 text-indigo-600" />
              Pending Contributions
            </h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-gray-500 hover:text-gray-200 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-200 text-gray-700"
                      >
                        <option value="all">All Types</option>
                        <option value="pr">Pull Requests</option>
                        <option value="event">Events</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-300 mt-2">Loading contributions...</p>
              </div>
            ) : pendingContributions.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                No pending contributions
              </div>
            ) : (
              pendingContributions.map((contribution: any) => (
                <div key={contribution.id} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{contribution.title}</h3>
                      <p className="text-sm text-gray-500">{contribution.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                      contribution.type === 'PR' ? 'bg-blue-50 text-blue-700' :
                      contribution.type === 'EVENT' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {contribution.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <img
                        src={contribution.user.avatar}
                        alt={contribution.user.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{contribution.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRejectContribution(contribution.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleApproveContribution(contribution.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Management */}
        <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center text-gray-200">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              User Management
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-300 mt-2">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                      user.role === 'super_admin' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                    {user.role !== 'admin' && user.role !== 'super_admin' && (
                      <button
                        onClick={() => handleMakeAdmin(user.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Make Admin
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Settings */}
        {user?.role === 'super_admin' && (
          <div className="bg-gray-400 bg-opacity-15 rounded-xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-200">
              <Settings className="h-5 w-5 mr-2 text-indigo-600" />
              System Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-300">General Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-indigo-600" />
                    <span className="text-gray-300">Enable email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-indigo-600" />
                    <span className="text-gray-300">Allow public contributions</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-indigo-600" />
                    <span className="text-gray-300">Require approval for all contributions</span>
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-gray-300">Advanced Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Maximum contribution size
                    </label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg">
                      <option>1MB</option>
                      <option>5MB</option>
                      <option>10MB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Auto-approval threshold
                    </label>
                    <select className="w-full p-2 border border-gray-200 rounded-lg">
                      <option>Never</option>
                      <option>Trusted users only</option>
                      <option>All users</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}